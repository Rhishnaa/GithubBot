/*
 
 Example Simple WhatsApp BOT
 Source https://github.com/zhwzein/ExampleSelep
 By zen's

*/

const {
    WAConnection,
    MessageType,
    Presence,
    MessageOptions,
    Mimetype,
    WALocationMessage,
    WA_MESSAGE_STUB_TYPES,
    ReconnectMode,
    ProxyAgent,
    GroupSettingChange,
    waChatKey,
    mentionedJid,
    processTime,
} = require("@adiwajshing/baileys")

// LOADER
const fs = require("fs")
const { spawn, exec } = require("child_process")
const { color, bgcolor } = require('./lib/color')
const { fetchJson, fetchText, getBase64 } = require('./lib/fetcher')
const { sleep, uploadImages, getBuffer, getGroupAdmins, getRandom } = require('./lib/functions')
const { menu } = require('./menu')

const axios = require("axios")
const ffmpeg = require('fluent-ffmpeg')
const moment = require("moment-timezone")
const request = require('request')

// DATABASE
const setting = JSON.parse(fs.readFileSync('./settings.json'))
const _simi = JSON.parse(fs.readFileSync('./database/simi.json'))

async function starts() {
const zn = new WAConnection()    
zn.version = [2, 2119, 6]
zn.logger.level = 'warn'
let authofile = './zenz.json'
zn.on('qr', () => {
    const time_connecting = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    console.log(color(time_connecting, "white"), color("[  STATS  ]", "yellow"), "Scan QR Code with WhatsApp")
})
fs.existsSync(authofile) && zn.loadAuthInfo(authofile)
zn.on('connecting', () => {
    const time_connecting = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    console.log(color(time_connecting, "white"), color("[  STATS  ]", "yellow"), "Connecting...")
})
zn.on('open', () => {
    const time_connect = moment.tz('Asia/Jakarta').format('HH:mm:ss')
    console.log(color(time_connect, "white"), color("[  STATS  ]", "yellow"), "Connected")
})
await zn.connect({ timeoutMs: 30 * 1000 })
fs.writeFileSync(authofile, JSON.stringify(zn.base64EncodedAuthInfo(), null, '\t'))

// CONFIG
selep = true
afk_respon = {}
var prefix = "."
var apikey = "YOURAPIKEY"
var fakethumb = '' || fs.readFileSync('./zenz/fake.jpeg')

zn.on('chat-update', async (mek) => {
	try {
        if (!mek.hasNewMessage) return
        mek = mek.messages.all()[0]
		if (!mek.message) return
		if (mek.key && mek.key.remoteJid == 'status@broadcast') return
		global.blocked
        mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? mek.message.ephemeralMessage.message : mek.message
        const content = JSON.stringify(mek.message)
		const from = mek.key.remoteJid
		const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
		const time = moment.tz('Asia/Jakarta').format('DD/MM HH:mm:ss')
        const type = Object.keys(mek.message)[0]        
        body = (type === 'conversation' && mek.message.conversation.startsWith(prefix)) ? mek.message.conversation : (type == 'imageMessage') && mek.message.imageMessage.caption.startsWith(prefix) ? mek.message.imageMessage.caption : (type == 'videoMessage') && mek.message.videoMessage.caption.startsWith(prefix) ? mek.message.videoMessage.caption : (type == 'extendedTextMessage') && mek.message.extendedTextMessage.text.startsWith(prefix) ? mek.message.extendedTextMessage.text : ''
		budy = (type === 'conversation') ? mek.message.conversation : (type === 'extendedTextMessage') ? mek.message.extendedTextMessage.text : ''
		resbutton = (type == 'listResponseMessage') ? mek.message.listResponseMessage.selectedDisplayText : ''
        const commandstik = Object.keys(mek.message)[0] == "stickerMessage" ? mek.message.stickerMessage.fileSha256.toString('base64') : ""
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()		
		const args = body.trim().split(/ +/).slice(1)
		const isCmd = body.startsWith(prefix)
        const ar = args.map((v) => v.toLowerCase())
		const q = args.join(' ')
		const botNumber = zn.user.jid
		const isGroup = from.endsWith('@g.us')
        
        const arg = budy.slice(command.length + 2, budy.length)
		const sender = isGroup ? mek.participant : mek.key.remoteJid
		const totalchat = await zn.chats.all()
		const groupMetadata = isGroup ? await zn.groupMetadata(from) : ''
		const groupName = isGroup ? groupMetadata.subject : ''
		const groupId = isGroup ? groupMetadata.jid : ''
		const groupMembers = isGroup ? groupMetadata.participants : ''
		const groupDesc = isGroup ? groupMetadata.desc : ''
		const groupOwner = isGroup ? groupMetadata.owner : ''
		const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
		const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
		const isGroupAdmins = groupAdmins.includes(sender) || false
        const isSimi = _simi.includes(sender) || false 
        const conts = mek.key.fromMe ? zn.user.jid : zn.contacts[sender] || { notify: jid.replace(/@.+/, '') }
        const pushname = mek.key.fromMe ? zn.user.name : conts.notify || conts.vname || conts.name || '-'

		const isUrl = (url) => {
        return url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%+.~#?&/=]*)/, 'gi'))
        }

        const reply = (teks) => {
            zn.sendMessage(from, teks, text, {quoted:mek})
        }

        const sendMess = (hehe, teks) => {
            zn.sendMessage(hehe, teks, text)
        }

        const mentions = (teks, memberr, id) => {
            (id == null || id == undefined || id == false) ? zn.sendMessage(from, teks.trim(), extendedText, { contextInfo: { "mentionedJid": memberr } }) : zn.sendMessage(from, teks.trim(), extendedText, { quoted: mek, contextInfo: { "mentionedJid": memberr } })
        }

		const isMedia = (type === 'imageMessage' || type === 'videoMessage')
		const isQuotedImage = type === 'extendedTextMessage' && content.includes('imageMessage')
		const isQuotedVideo = type === 'extendedTextMessage' && content.includes('videoMessage')
		const isQuotedAudio = type === 'extendedTextMessage' && content.includes('audioMessage')
		const isQuotedSticker = type === 'extendedTextMessage' && content.includes('stickerMessage')

        // LOG
        if (isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color('[ EXEC ]'), 'from', color(sender.split("@")[0]), 'in', color(groupName))
        if (!isGroup && isCmd) console.log(color(`[${time}]`, 'yellow'), color("[ EXEC ]"), 'from', color(sender.split("@")[0]))

        // FUNCTION
        if (!isGroup && !isCmd && isSimi) {
            if (mek.key.fromMe === false && ! from.includes("status@broadcast")){
                await zn.updatePresence(from, Presence.composing)
            try {
                simi = await axios.get(`https://zenzapi.xyz/api/simih?text=${budy}&apikey=${apikey}`)
                reply(simi.data.result.message)
            } catch {
                reply(`error`)
            }}
        }

        if (setting.responder.status){
            if (!isGroup){
                if (mek.key.fromMe === false && ! from.includes("status@broadcast")){
                    if(! afk_respon[sender]){
                        afk_respon[sender] = true
                        const getReason = setting.responder.reason
                        zn.sendMessage(from, menu.afk(pushname, getReason), text, [sender])
                    }
                }
            }
        }

        if (!isGroup && !isCmd) {
            if (mek.key.fromMe === false && ! from.includes("status@broadcast")){
                if (budy.match('mulai')){
                    _simi.push(from)
                    fs.writeFileSync('./database/simi.json', JSON.stringify(_simi))
                    reply('Halo ada yg bisa saya bantu ?')
                } else if (budy.match('stop')){
                    var simo = _simi.indexOf(from)
                    _simi.splice(simo, 1)
                    fs.writeFileSync('./database/simi.json', JSON.stringify(_simi))
                    reply('BOT chatt sukses dimatikan')
                }
            }
        }

        // SELF ON
        if (!mek.key.fromMe && selep === true) return

        // QUOTES
        if (resbutton == 'Dilan Quotes') {
            dilan = await axios.get(`https://zenzapi.xyz/api/dilanquote?apikey=${apikey}`)
            reply(`${dilan.data.result.message}`, text)
        } else if (resbutton == 'Random Quotes') {
            quotes = await axios.get(`https://zenzapi.xyz/api/random/quote?apikey=${apikey}`)
            reply(`${quotes.data.result.quote}\n\nby ${quotes.data.result.by}`, text)
        } else if (resbutton == 'Random Motivasi') {
            motivasi = await axios.get(`https://zenzapi.xyz/api/motivasi?apikey=${apikey}`)
            reply(`${motivasi.data.result.message}`, text)
        } else if (resbutton == 'Bucin Quotes') {
            bucin = await axios.get(`https://zenzapi.xyz/api/bucinquote?apikey=${apikey}`)
            reply(`${bucin.data.result.message}`, text)
        } else if (resbutton == 'Senja Quotes') {
            senja = await axios.get(`https://zenzapi.xyz/api/katasenja?apikey=${apikey}`)
            reply(`${senja.data.result.message}`, text)
        } else if (resbutton == 'Islami Quotes') {
            islami = await axios.get(`https://zenzapi.xyz/api/randomquote/muslim?apikey=${apikey}`)
            reply(`${islami.data.result.text_id}`, text)
        } else if (resbutton == 'Anime Quotes') {
            get_result = await fetchJson(`https://zenzapi.xyz/api/anime-quotes?apikey=${apikey}`)
            get_result = get_result.result
            txt = `anime : ${get_result.anime}\n`
            txt += `character : ${get_result.character}\n\n`
            txt += `quote : ${get_result.quote}`
            reply(txt, text)
        }

        // RANDOM
        if (resbutton == 'Creepy Fact') {
            creepyfact = await axios.get(`https://zenzapi.xyz/api/creepyfact?apikey=${apikey}`)
            reply(`${creepyfact.data.result.message}`, text)
        } else if (resbutton == 'Fakta Unik') {
            faktaunik = await axios.get(`https://zenzapi.xyz/api/faktaunik?apikey=${apikey}`)
            reply(`${faktaunik.data.result}`, text)
        } else if (resbutton == 'Random Meme') {
            buffer = await getBuffer(`https://zenzapi.xyz/api/random/memeindo?apikey=${apikey}`)
            zn.sendMessage(from, buffer, image, { quoted: mek })
        } else if (resbutton == 'Random DarkJokes') {
            buffer = await getBuffer(`https://zenzapi.xyz/api/random/darkjoke?apikey=${apikey}`)
            zn.sendMessage(from, buffer, image, { quoted: mek })
        } 

        switch (commandstik) {

            case "sy02F/UUYrbPVGOKfTuEakAK/KIfwmipVKZ2QS6pe4A=":
                let stikquotes = zn.prepareMessageFromContent(from, {
                    "listMessage":  {
                        "title": "*Z E N Z - A P I*",
                        "description": "Available Quotes Commands",
                        "buttonText": "Open Here",
                        "listType": "SINGLE_SELECT",
                        "sections": [
                            {
                                "rows": [
                                    {
                                        "title": `Random Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Random Motivasi`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Bucin Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Senja Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Islami Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Anime Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": "Dilan Quotes",
                                        "rowId": ""
                                    }
                                ]
                            }
                        ]
                    }
                }, {})
            zn.relayWAMessage(stikquotes, {waitForAck: true})
            break
            case "7THhxG0GXfRzCR2YFXjBmOExfhf7ialY2vd9VFm6VGE=":
                let stikrandom = zn.prepareMessageFromContent(from, {
                    "listMessage":  {
                        "title": "*Z E N Z - A P I*",
                        "description": "Available Random Commands",
                        "buttonText": "Open Here",
                        "listType": "SINGLE_SELECT",
                        "sections": [
                            {
                                "rows": [
                                    {
                                        "title": `Creepy Fact`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Fakta Unik`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Random Meme`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": "Random DarkJokes",
                                        "rowId": ""
                                    }
                                ]
                            }
                        ]
                    }
                }, {})
            zn.relayWAMessage(stikrandom, {waitForAck: true})
            break
            /*case '7THhxG0GXfRzCR2YFXjBmOExfhf7ialY2vd9VFm6VGE=':
                reply(`Mengrandom`)
            break*/

        }
        
        switch (command) {

            case 'hash':
                if (!isQuotedSticker) return reply('Reply Stickernya')
                const encmeds = JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo
                const mediastick = await zn.downloadMediaMessage(encmeds)
                var crypto = require('crypto')
                hash = crypto.createHash('sha256').update(mediastick).digest('base64');
                console.log(hash)
            break
            case 'help':
            case 'menu':
                var numberwa = "0@s.whatsapp.net"
                var textnya = " Z E N Z - A P I"
                menus = {
                    contextInfo: {
                        stanzaId: 'B826873620DD5947E683E3ABE663F263',
                        participant: numberwa,
                        remoteJid: 'status@broadcast',
                        quotedMessage: {
                            imageMessage: {
                                caption: textnya,
                                jpegThumbnail: fakethumb
                            }
                        }
                    }
                }
                zn.sendMessage(from, menu.Help(prefix), text, menus)
            break
            case 'quotes':
                let quotes = zn.prepareMessageFromContent(from, {
                    "listMessage":  {
                        "title": "*Z E N Z - A P I*",
                        "description": "Available Quotes Commands",
                        "buttonText": "Open Here",
                        "listType": "SINGLE_SELECT",
                        "sections": [
                            {
                                "rows": [
                                    {
                                        "title": `Random Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Random Motivasi`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Bucin Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Senja Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Islami Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Anime Quotes`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": "Dilan Quotes",
                                        "rowId": ""
                                    }
                                ]
                            }
                        ]
                    }
                }, {})
            zn.relayWAMessage(quotes, {waitForAck: true})
            break
            case 'random':
                let random = zn.prepareMessageFromContent(from, {
                    "listMessage":  {
                        "title": "*Z E N Z - A P I*",
                        "description": "Available Random Commands",
                        "buttonText": "Open Here",
                        "listType": "SINGLE_SELECT",
                        "sections": [
                            {
                                "rows": [
                                    {
                                        "title": `Creepy Fact`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Fakta Unik`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": `Random Meme`,
                                        "rowId": ""
                                    },
                                    {
                                        "title": "Random DarkJokes",
                                        "rowId": ""
                                    }
                                ]
                            }
                        ]
                    }
                }, {})
            zn.relayWAMessage(random, {waitForAck: true})
            break

            // OWNER
            case 'setfake':
            if ((isMedia && !mek.message.videoMessage || isQuotedImage || isQuotedSticker) && args.length == 0) {
                setf = isQuotedImage || isQuotedSticker ? JSON.parse(JSON.stringify(mek).replace('quotedM','m')).message.extendedTextMessage.contextInfo : mek
                setb = await zn.downloadMediaMessage(setf)
                fs.writeFileSync(`./zenz/fake.jpeg`, setb)
                reply('Sukses')
            } else {
                reply(`Kirim gambar dengan caption ${prefix}setfake`)
            }
            break
            case 'setprefix':
                if (!mek.key.fromMe) return
                prefix = q
                reply(`Prefix berhasil diubah ke : *${prefix}*`)
            break
            case 'public':
                if (!mek.key.fromMe) return
                if (selep === false) return zn.sendMessage(from, 'Mode Public already active', text)
                selep = false
                reply(`Success activated Mode Public`)
            break
            case 'self':
                if (!mek.key.fromMe) return 
                if (selep === true) return zn.sendMessage(from, 'Mode Self already active', text)
                selep = true
                reply(`Success activated Mode Self`)
            break
            /*case 'simi':
                if (ar[0] === 'enable') {
                    if (simih === false) return zn.sendMessage(from, 'Mode Simi already active', text)
                    simih = false
                    reply(`Success activated Mode Simi`)
                } else if (ar[0] === 'disable') {
                    if (simih === true) return zn.sendMessage(from, 'Mode Simi already deactive', text)
                    simih = true
                    reply(`Success deactivated Mode Simi`)
                } else {
                    reply('Pilih enable atau disable!')
                }
            break*/
            case 'afk':
                setting.responder.reason = q ? q : 'Nothing.'
                fs.writeFileSync('./settings.json', JSON.stringify(setting, null, 2))

                setting.responder.status = true
                fs.writeFileSync('./settings.json', JSON.stringify(setting, null, 2))
                zn.sendMessage(from, `Afk activated dengan alasan :\n${setting.responder.reason}`, text)
            break
            case 'unafk':
                if (setting.responder.status == false){
                    zn.sendMessage(from, `Afk Mode already deactivated`, text)
                } else {
                    setting.responder.status = false
                    fs.writeFileSync('./settings.json', JSON.stringify(setting, null, 2))
                    zn.sendMessage(from, `Afk deactivated`, text)
                }
            break

            default:

                if (budy.startsWith('>')){
                    try {
                        return zn.sendMessage(from, JSON.stringify(eval(budy.slice(2)),null,'\t'),text, {quoted: mek})
                    } catch(err) {
                        e = String(err)
                        reply(e)
                    }
                } 

            }

        } catch (e) {
            e = String(e)
            if (!e.includes("this.isZero")) {
                console.log('Message : %s', color(e, 'green'))
            }
        }

})

} starts()
