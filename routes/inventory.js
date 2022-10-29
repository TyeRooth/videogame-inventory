const express = require("express");
const router = express.Router();

const videogameController = require("../controllers/videogameController");
const genreController = require("../controllers/genreController");
const consoleController = require("../controllers/consoleController");

router.get('/', videogameController.index);

// Videogame routes

router.get("/videogame/create", videogameController.videogame_create_get);
router.post("/videogame/create", videogameController.videogame_create_post);

router.get("/videogame/:id/delete", videogameController.videogame_delete_get);
router.post("/videogame/:id/delete", videogameController.videogame_delete_post);

router.get("/videogame/:id/update", videogameController.videogame_update_get);
router.post("/videogame/:id/update", videogameController.videogame_update_post);

router.get("/videogame/:id", videogameController.videogame_detail);
router.get("/videogames", videogameController.videogame_list);

// Genre routes

router.get("/genre/create", genreController.genre_create_get);
router.post("/genre/create", genreController.genre_create_post);

router.get("/genre/:id/delete", genreController.genre_delete_get);
router.post("/genre/:id/delete", genreController.genre_delete_post);

router.get("/genre/:id/update", genreController.genre_update_get);
router.post("/genre/:id/update", genreController.genre_update_post);

router.get("/genre/:id", genreController.genre_detail);
router.get("/genres", genreController.genre_list);

// Console routes

router.get("/console/create", consoleController.console_create_get);
router.post("/console/create", consoleController.console_create_post);

router.get("/console/:id/delete", consoleController.console_delete_get);
router.post("/console/:id/delete", consoleController.console_delete_post);

router.get("/console/:id/update", consoleController.console_update_get);
router.post("/console/:id/update", consoleController.console_update_post);

router.get("/console/:id", consoleController.console_detail);
router.get("/consoles", consoleController.console_list);

module.exports = router;

