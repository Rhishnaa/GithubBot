const fs = require('fs')
const axios = require('axios')
const fetch = require('node-fetch')
const FormData = require('form-data')
const { fromBuffer } = require('file-type');

const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}

const uploadImages = (buffData, type) => {
  return new Promise(async (resolve, reject) => {
      const { ext } = fromBuffer(buffData)
      const filePath = './zenz' + ext
      fs.writeFile(filePath, buffData, { encoding: 'base64' }, (err) => {
          if (err) return reject(err)
          console.log('Uploading image to Telegra.ph server...')
          const fileData = fs.readFileSync(filePath)
          const form = new FormData()
          form.append('file', fileData, 'tmp.' + ext)
          fetch('https://telegra.ph/upload', {
              method: 'POST',
              body: form
          })
          .then(res => res.json())
          .then(res => {
              if (res.error) return reject(res.error)
              resolve('https://telegra.ph' + res[0].src)
              console.log('Done')
          })
          .then(() => fs.unlinkSync(filePath))
          .catch(err => reject(err))
      })
  })
}

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (e) {
		console.log(`Error : ${e}`)
	}
}

const getGroupAdmins = (participants) => {
	admins = []
	for (let i of participants) {
		i.isAdmin ? admins.push(i.jid) : ''
	}
	return admins
}

const getRandom = (ext) => {
	return `${Math.floor(Math.random() * 10000)}${ext}`
}

module.exports = { sleep, uploadImages, getBuffer, getGroupAdmins, getRandom }
