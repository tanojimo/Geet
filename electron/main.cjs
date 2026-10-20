const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const fs = require("node:fs/promises");
const path = require("node:path");
const { parseFile } = require("music-metadata");
const dataBase = require("better-sqlite3");

const isDev = !app.isPackaged;
const db = new dataBase(path.join(app.getPath("userData"), "songs.db"));
db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

const schema = `
  CREATE TABLE IF NOT EXISTS albums(
    id     INTEGER PRIMARY KEY,
    name   TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS folders(
    id     INTEGER PRIMARY KEY,
    path   TEXT UNIQUE
  );

  CREATE TABLE IF NOT EXISTS artists(
    id     INTEGER PRIMARY KEY,
    name   TEXT NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS playlists(
    id     INTEGER PRIMARY KEY,
    name   TEXT NOT NULL
    );
    
    CREATE TABLE IF NOT EXISTS songs(
    id            INTEGER PRIMARY KEY,
    title         TEXT NOT NULL DEFAULT "Unknown Song",
    path          TEXT UNIQUE,
    albumId       INTEGER REFERENCES albums(id) ON DELETE SET NULL,
    folderId      INTEGER REFERENCES folders(id) ON DELETE SET NULL,
    codec         TEXT,
    duration      REAL,
    bitRate       REAL,
    sampleRate    REAL,
    cover         BLOB,
    coverMime     TEXT,
    releaseYear   INTEGER,
    isFav         INTEGER NOT NULL DEFAULT 0,
    totalPlay     INTEGER NOT NULL DEFAULT 0
    );
    
    CREATE TABLE IF NOT EXISTS artistToSong(
      artistId     INTEGER NOT NULL REFERENCES artists(id) ON DELETE CASCADE,
      songId         INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
      PRIMARY KEY    (artistId, songId)
      );

    CREATE TABLE IF NOT EXISTS playlistToSong(
      playlistId     INTEGER NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
      songId         INTEGER NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
      PRIMARY KEY    (playlistId, songId)
    );
      `;
db.exec(schema);

const insert = (table, val) => {
  const insertPrep = {
    song: db.prepare(
      `INSERT INTO songs (title, path, albumId, folderId, codec, duration, bitRate, sampleRate, cover, coverMime, releaseYear)
      VALUES (@title, @path, @albumId, @folderId, @codec, @duration, @bitRate, @sampleRate, @cover, @coverMime, @releaseYear)`,
    ),
    album: db.prepare("INSERT INTO albums (name) VALUES (?)"),
    artist: db.prepare("INSERT INTO artists (name) VALUES (?)"),
    playlist: db.prepare("INSERT INTO playlists (name) VALUES (?)"),
    folder: db.prepare("INSERT INTO folders (path) VALUES (?)"),
  };
  if (table === "album") {
    const r = insertPrep.album.run(val);
    return r;
  } else if (table === "artist") {
    const r = insertPrep.artist.run(val);
    return r;
  } else if (table === "playlist") {
    const r = insertPrep.playlist.run(val);
    return r;
  } else if (table === "folder") {
    const r = insertPrep.folder.run(val);
    return r;
  } else if (table === "song") {
    const r = insertPrep.song.run(val);
    return r;
  } else {
    return null;
  }
};

const linkArtistToSong = db.prepare(`
  INSERT OR IGNORE INTO artistToSong (artistId, songId)
  VALUES (?, ?)
  `);

const linkPlaylistToSong = db.prepare(`
  INSERT OR IGNORE INTO playlistToSong (playlistId, songId)
  VALUES (?, ?)
  `);

const find = (table, val) => {
  const findPrep = {
    song: db.prepare("SELECT id FROM songs WHERE path = ?"),
    album: db.prepare("SELECT id FROM albums WHERE name = ?"),
    artist: db.prepare("SELECT id FROM artists WHERE name = ?"),
    playlist: db.prepare("SELECT id FROM playlists WHERE name = ?"),
    folder: db.prepare("SELECT id FROM folders WHERE path = ?"),
  };
  if (table === "album") {
    const r = findPrep.album.get(val);
    return r;
  } else if (table === "artist") {
    const r = findPrep.artist.get(val);
    return r;
  } else if (table === "playlist") {
    const r = findPrep.playlist.get(val);
    return r;
  } else if (table === "folder") {
    const r = findPrep.folder.get(val);
    return r;
  } else if (table === "song") {
    const r = findPrep.song.get(val);
    return r;
  } else {
    return null;
  }
};

const getEach = db.prepare("SELECT * FROM songs WHERE ?");
const getAll = db.prepare("SELECT * FROM songs");

const getArtist = db.prepare(`
  SELECT artists.name
  FROM artists
  JOIN artistToSong ats ON ats.artistId = artists.id
  WHERE ats.songId = ?  
`);

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: "Geet",
    titleBarStyle: "hidden",
    resizable: true,
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
    webPreferences: {
      preload: path.join(__dirname, "preload.cjs"),
      enableRemoteModule: true,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadURL("http://localhost:5173");

  win.setMenuBarVisibility(false);

  if (isDev) {
    win.webContents.once("dom-ready", () => {
      win.webContents.openDevTools();
      setTimeout(() => {
        win.webContents.reload();
      }, 500);
    });
  }
}

// Windows Controls

ipcMain.on("window:minimize", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.minimize();
});

ipcMain.on("window:close", (event) => {
  BrowserWindow.fromWebContents(event.sender)?.close();
});

ipcMain.handle("window:toggle-maximize", (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (!win) return false;

  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }

  return win.isMaximized();
});

ipcMain.handle("window:is-maximized", (event) => {
  return BrowserWindow.fromWebContents(event.sender)?.isMaximized() ?? false;
});

// Folder Prompt

ipcMain.handle("folder:prompt", async (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);

  const r = await dialog.showOpenDialog(win, {
    properties: ["openDirectory", "multiSelections"],
    filters: [
      { name: "Audio Files", extensions: ["mp3", "ogg", "flac", "wav", "m4a"] },
    ],
  });

  if (r.canceled || r.filePaths.length == 0) {
    return [];
  }

  let skipped = 0;
  let failed = 0;
  let imported = 0;

  const folderPaths = r.filePaths;
  for (const folderPath of folderPaths) {
    const s = await fs.readdir(folderPath, {
      withFileTypes: true,
    });
    const songs = s
      .filter(
        (song) =>
          song.isFile() &&
          [".mp3", ".ogg", ".flac", ".wav", ".m4a"].includes(
            path.extname(song.name).toLowerCase(),
          ),
      )
      .map((song) => ({
        name: song.name,
        path: path.join(folderPath, song.name),
      }));

    for (const song of songs) {
      if (find("song", song.path)) {
        skipped++;
        continue;
      }
      try {
        const metaData = await parseFile(song.path);
        let songId, folderId, albumId, artistId;

        const albumName = metaData.common?.album?.trim() || null;
        const artistString =
          metaData.common.artist || metaData.common.artist?.join(", ") || "";
        const artists = artistString.split(",").map((name) => name.trim());
        const title =
          metaData.common.title?.trim() ||
          path.basename(song.path, path.extname(song.path));

        const foundFolder = find("folder", folderPath);
        if (!foundFolder) {
          const result = insert("folder", folderPath);
          folderId = Number(result.lastInsertRowid);
        } else {
          folderId = foundFolder?.id;
        }
        if (albumName) {
          const foundAlbum = find("album", albumName);
          if (!foundAlbum) {
            const result = insert("album", albumName);
            albumId = Number(result.lastInsertRowid);
          } else {
            albumId = foundAlbum?.id;
          }
        }

        const result = insert("song", {
          title: title,
          path: song.path,
          albumId: albumId,
          folderId: folderId,
          codec: metaData.format?.codec ?? "Unknown",
          duration: metaData.format?.duration ?? null,
          bitRate: metaData.format?.bitrate ?? null,
          sampleRate: metaData.format?.sampleRate ?? null,
          cover: metaData.common.picture?.[0]?.data ?? null,
          coverMime: metaData.common.picture?.[0]?.format ?? null,
          releaseYear: metaData.common?.year ?? null,
        });
        songId = result.lastInsertRowid;

        artists.forEach((artist) => {
          const foundArtist = find("artist", artist);
          if (!foundArtist) {
            const result = insert("artist", artist);
            artistId = result.lastInsertRowid;
          } else {
            artistId = foundArtist?.id;
          }
          linkArtistToSong.run(artistId, songId);
        });
        imported++;
      } catch (e) {
        failed++;
        return e;
      }
    }
  }
  return { skipped: skipped, imported: imported, failed: failed };
});

ipcMain.handle("song:data", () => {
  let data = getAll.all();
  data.forEach((song, i) => {
    song.artists = getArtist.all(song.id).map((artist) => artist.name);
    let coverUrl = null;
    if (song.cover && song.coverMime) {
      coverUrl = `data:${song.coverMime};base64,${Buffer.from(song.cover).toString("base64")}`;
    }
    song.cover = coverUrl;
  });
  return data;
});

app.whenReady().then(async () => {
  if (isDev) {
    try {
      const {
        default: installExtension,
        REACT_DEVELOPER_TOOLS,
      } = require("electron-devtools-installer");
      const name = await installExtension(REACT_DEVELOPER_TOOLS);
    } catch (e) {
      console.log("ERROR: ", e);
    }
  }
  createWindow();
});
