const express = require('express')
const { Octokit } = require('@octokit/core')
const cors = require('cors')
const path = require('path')
const data = require('./data/stock.json')
require('dotenv').config()

const octokit = new Octokit({
	auth: process.env.GITHUB_TOKEN
})

const app = express()

const port = process.env.PORT || 5000

app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/views/index.html'))
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

app.listen(port)
