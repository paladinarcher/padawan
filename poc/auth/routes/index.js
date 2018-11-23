const express = require('express');
const router = express.Router();

/*
 *	returns simple object, including any query params
 */
router.get('/', (req, res, next) => {

	res.json({
		name: "Best api ever", 
		version: 1,
		queryString: req.query,
	});
	next();
});

/*
 * http://localhost:8888/api/v1/reverse/reversethis
 * 
 * {
 * 	"reversedValue": "sihtesrever"
 * }
 */
router.get('/reverse/:name', (req, res, next) => {
	res.json({
		reversedValue: [...req.params.name].reverse().join(''),
	});
	next();
});

module.exports = router;