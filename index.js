const express = require('express')
const fetch = require('node-fetch')
const data = require('./data/stock.json')
require('dotenv').config()

const app = express()

const port = process.env.PORT || 5000

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.listen(port)

app.get('/', (req, res) => {
	res.render('index')
})

app.get('/all', (req, res) => {
	res.send(data)
})

app.post('/update', async (req, res) => {
	console.log(req.body)
	const post = await fetch(
		'https://api.github.com/repos/hicksonwei/stock-api/contents/data/stock.json',
		{
			method: 'POST',
			body: {
				owner: 'hicksonwei',
				repo: 'stock-api',
				path: 'data/stock.json',
				message: `Data ${req.body.date} Update`,
				content: JSON.stringify(req.body)
			}
		}
	)
	const response = await post.json()

	res.send(response)
})
