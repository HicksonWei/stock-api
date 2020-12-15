const express = require('express')
const fetch = require('node-fetch')
const { Octokit } = require('@octokit/core')
const data = require('./data/stock.json')
require('dotenv').config()

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN
})

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
	try {
		const { data } = await octokit.request(
			'GET https://api.github.com/repos/HicksonWei/stock-api/contents/data/stock.json'
		)

		console.log('request', data.sha)
		const response = await octokit.request(
			'PUT https://api.github.com/repos/HicksonWei/stock-api/contents/data/stock.json',
			{
				owner: 'HicksonWei',
				repo: 'stock-api',
				path: 'data/stock.json',
				message: `Data ${req.body.date} Update`,
				content: Buffer.from(JSON.stringify(req.body)).toString('base64'),
				sha: data.sha
			}
		)

		res.send(response)
	} catch (err) {
		console.log(err)
	}
})
