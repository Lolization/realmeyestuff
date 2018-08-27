const Discord = require("discord.js");
const bot = new Discord.Client();
const snekfetch = require("snekfetch");
const fs = require('fs');
const Nightmare = require('nightmare');
const nightmare = Nightmare();
const itemID = require('./idtoname.json');
const itemName = require('./nametoid.json');
const HTMLParser = require('fast-html-parser');
const moment = require('moment');
let test = JSON.parse('{}');
const talkedRecently = new Set();

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}`);
    bot.user.setActivity('the Nexus | /info', {
        type: 'WATCHING'
    })
});

bot.on('guildMemberAdd', member => {
    if (member.guild.id == '466690926702755841') {
        var memberrole = member.guild.roles.find('name', 'Initiates');
        member.addRole(memberrole)
        bot.channels.get('466746073822527488').send(`Welcome ${member} to Guill's Support Server <:guill:466746583271211009>!`)
    }
})
const prefix = '/'

function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}
bot.on('message', async msg => { // START MESSAGE HANDLER
    if (msg.author.bot) return;
    if (!msg.content.startsWith(prefix)) return;
    let args = msg.content.split(" ");

    if (msg.channel.type === 'dm') {
        msg.author.send({
            embed: {
                color: 0xFF0000,
                description: "⚠ Sorry, I don't respond to DMs!",
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: "© Droid & Co."
                }
            }
        })
        console.log(`${msg.author.username} tried to DM me!`)
        bot.channels.get('466815252131086342').send(`${msg.author.username} tried to DM me! Message: ${msg.content} \`[${moment().format("LT")}]\``)
        return;
    }

    if (talkedRecently.has(msg.author.id)) {
        msg.channel.send({
            embed: {
                color: 0xFF0000,
                description: "⚠ You're on cooldown! Wait 2 seconds before using another command!",
                timestamp: new Date(),
                footer: {
                    icon_url: bot.user.avatarURL,
                    text: "© Droid & Co."
                }
            }
        })
        console.log(`${msg.author.username} was put on cooldown!`)
        bot.channels.get('466815252131086342').send(`${msg.author.username} was put on cooldown!`)
    } else {

        if (msg.channel.id === '466730978971484171') return msg.reply('No commands in general chat <:reeeee:467041346130018305>, Go to <#466731030338994176>!')


        if (msg.content.toLowerCase().startsWith(prefix + 'invitelinks')) {
            if (msg.author.id !== '368756694114893825') return;
            var allguilds = bot.guilds.array();
            allguilds.forEach((guild) => {

                var randomchannel = guild.channels.first();
                randomchannel.createInvite()
                    .then(invite => {
                        msg.author.send(`${guild.name}: ${invite.url}`)
                    })
            })


        } if (msg.content.startsWith(prefix + 'seehowmany')) {
            var allfuckingguilds = bot.guilds.array()
            console.log(allfuckingguilds.length)
            var totalnumberofusers = 0
            var skippedpeople = 0
            var allfuckingusers = []
            var i;
            var j;
            for (i in allfuckingguilds) {
                var somestupidshit = allfuckingguilds[i].members.array()
                for (j in somestupidshit) {
                    if (allfuckingusers.includes(somestupidshit[j].id)) {
                        console.log(`skipped ${somestupidshit[j].displayName}`)
                        skippedpeople += 1
                    } else {
                        allfuckingusers.push(somestupidshit[j].id)
                        totalnumberofusers += 1
                    }
                }
            }
            console.log(`total users: ${totalnumberofusers}`)
            console.log(`total skipped users: ${skippedpeople}`)


        }
        if (msg.content.toLowerCase().startsWith(prefix + 'launch')) {
            if (!msg.content.includes('absolute')) return console.log(bot.users.array().length);
            if (msg.author.id != '368756694114893825') return;
            var allusers = bot.users.array();
            allusers.forEach((member) => {
                console.log(member.id)

                member.send(`__**${bot.user}'s Recent Updates**__
\n*I'm terribly sorry if you are annoyed by this pm, it's one of the very few times you will get something like this*
\n\nGuill has been public and online for about a month now, and has over **11K** users and on **200+** active servers! What a great achievment. A big thanks to all of you for supporting Guill and his development, and I hope all of you continue to do so!
\nDevelopment will continue on Guill, including trades, and hopefully graveyards too! Item emojis have been added, so if you haven't seen so, check it out by using the \`/char\` in a server! 
\n\n__**Partners**__
\n[Deca Debrief](https://itunes.apple.com/us/podcast/deca-debrief/id1418676717) is a podcast dedicated to covering news, updates, events, and the community of RotMG. Each week they bring on youtubers, UGC creators, and developers to discuss the current state of the game, where it's headed, and learn more about them Go show them some love!.
\nThe [RotMG Ideas Discord](https://discord.gg/bgrvxbW) is a place for enthusiastic RotMG Players to discuss ideas they've had regarding the game and its improvement. Join the discord and share your wonderful ideas!
\n\n**Important Links:**
\nPlease support the following links, and thanks for supporting Guill!
\nOfficial Website: https://guill.glitch.me
\nReddit Community: https://www.reddit.com/r/guill/ 
\nSupport Server Invite: https://discord.gg/3Gby6sT
`)
            })

        }


        if (msg.content.toLowerCase().startsWith('/serverinfo')) {


            msg.guild.fetchMembers();

            let members = msg.guild.members;
            let online = members.filter(m => m.user.presence.status === 'online').size
            const offline = members.filter(m => m.user.presence.status === 'offline').size
            const dnd = members.filter(m => m.user.presence.status === 'dnd').size
            const idle = members.filter(m => m.user.presence.status === 'idle').size
            const streaming = members.filter(m => m.user.presence.game ? m.user.presence.game.streaming === true : false).size
            online = online - streaming;


            //  message.channel.send(`<a:online:464867216668753931> ${online}\n<a:idle:464867250269061120> ${idle} \n<a:dnd:464867303176142849> ${dnd}\n<a:streaming:464867426090090504> ${streaming}\n<a:offline:464867377767645195> ${offline}`);

            //getting roles and formatting it
            const roles = msg.guild.roles.map(r => r.id)
            let roleLength = roles.length;
            var i = 0;
            var RoleList = "";
            for (; i < roleLength; i++) {
                RoleList += "<@&" + roles[i] + "> | "
            }
            //getting server age
            var now = new Date().getTime();
            var countDownDate = msg.guild.createdTimestamp;
            var distance = now - countDownDate;
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            let time = days + "days, " + hours + "hours, and " + minutes + "m ago";

            //getting Emojis
            var emojiList = msg.guild.emojis.map(e => e.toString()).join(" ");
            if (emojiList.length > 1000) {
                emojiList = "Too many emojis <:oof:466692716563005452>"
            }
            if (emojiList.length < 2) {
                emojiList = "No emojis on this server <:oof:466692716563005452>"
            }

            //checking if embed is to long
            if (RoleList.length > 1000) {
                RoleList = "Too many roles <:ono:464908543984795648>"
            }

            //sending the info
            const info = new Discord.RichEmbed()
                .setColor(0x000000)
                .setFooter(" © Droid & Co", bot.user.avatarURL)
                .setTimestamp()
                .setTitle('Server Info')
                .addField("Name", msg.guild.name, true)
                .addField("Region", msg.guild.region, true)
                .addField("Owner", "<@" + msg.guild.ownerID + ">")
                .addField("Created", time)
                .addField("Members (" + msg.guild.memberCount + ")", "\n<a:online:464867216668753931> " + online + "\n<a:idle:464867250269061120> " + idle + "\n<a:dnd:464867303176142849> " + dnd + "\n<a:streaming:464867426090090504>" + streaming + "\n<a:offline:464867377767645195> " + offline, true)
                .addField("Verification Level", msg.guild.verificationLevel, true)
                .addField("Roles", RoleList)
                .addField("Emojis", emojiList)
            msg.channel.send(info).catch(error => { });

            (`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            //<a:streaming:464867426090090504>
        }

        if (msg.content.startsWith(prefix + 'stats')) {
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            var allusersever = 0
            var allguilds = bot.guilds.array()
            for (i in allguilds) {
                allusersever += allguilds[i].memberCount
            }
            msg.channel.send(`\`\`\`asciidoc\n= STATISTICS =
• Users      :: ${allusersever}
• Servers    :: ${bot.guilds.size.toLocaleString()}
• Channels   :: ${bot.channels.size.toLocaleString()}\`\`\``);
        }
        if (msg.content.toLowerCase().startsWith(prefix + 'ban')) {

            if (!msg.guild.member(msg.author).hasPermission('BAN_MEMBERS')) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ You do not have permission to ban!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            var banmemb = msg.mentions.members.first()
            var banreason = args.slice(2).join(' ');
            if (!banmemb) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a user to ban!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (!banmemb.bannable) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ I do not have permission to ban this member!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (!banreason) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a reason for the ban!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            var bannerpos = msg.guild.member(msg.author).highestRole.calculatedPosition
            var bannedmemb = banmemb.highestRole.calculatedPosition

            if (!bannerpos > bannedmemb) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ You cannot ban this user, he/she has a higher role than you!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            banmemb.send({
                embed: {
                    color: 0xFFB400,
                    description: `You have been **banned** from ${msg.guild.name} by ${msg.author}! \n\n**Reason:** ${banreason} \n\n❓ Questions about your ban? Please message the user who banned you **privately** to dispute it.`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            banmemb.ban(banreason).catch(error => msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: `<:error:459473621233041428> An error ocurred. Err Msg: ${error}`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            }))
            msg.channel.send({
                embed: {
                    color: 0x3BF601,
                    description: `<:check:459473621031583765> ${banmemb} was successfully banned!`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })

        }
        if (msg.content.toLowerCase().startsWith(prefix + 'kick')) {
            if (!msg.guild.member(msg.author).hasPermission('KICK_MEMBERS')) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ You do not have permission to kick!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            var kickmemb = msg.mentions.members.first();
            var kickreason = args.slice(2).join(' ');
            if (!kickmemb) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a user to kick!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (!kickmemb.kickable) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ I do not have permission to kick this member!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (!kickreason) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a reason for the kick!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            var kickerpos = msg.guild.member(msg.author).highestRole.calculatedPosition
            var kickedmemb = kickmemb.highestRole.calculatedPosition

            if (!kickerpos > kickedmemb) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ You cannot kick this user, he/she has a higher role than you!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            kickmemb.send({
                embed: {
                    color: 0xFFB400,
                    description: `You have been **kicked** from ${msg.guild.name} by ${msg.author}! \n\n**Reason:** ${kickreason} \n\n❓ Questions about your kick? Please message the user who banned you **privately** to dispute it.`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            kickmemb.kick(kickreason).catch(error => msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: `<:error:459473621233041428> An error ocurred. Err Msg: ${error}`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            }))
            msg.channel.send({
                embed: {
                    color: 0x3BF601,
                    description: `<:check:459473621031583765> ${kickmemb} was successfully kicked!`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })


        }
        if (msg.content.toLowerCase().startsWith(prefix + 'warn')) {
            var warnmemb = msg.mentions.members.first();
            var warnreason = args.slice(2).join(' ');
            if (!msg.guild.member(msg.author).hasPermission('ADMINISTRATOR')) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ You do not have permission to warn users, only Admins do!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (!warnmemb) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a user to warn!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (!warnreason) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a reason for the warn",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            warnmemb.send({
                embed: {
                    color: 0xFFB400,
                    description: `You have been **warned** from ${msg.guild.name} by ${msg.author}! \n\n**Reason:** ${warnreason} \n\n❓ Questions about your warn? Please message the user who banned you **privately** to dispute it.`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            msg.channel.send({
                embed: {
                    color: 0x3BF601,
                    description: `<:check:459473621031583765> ${warnmemb} was successfully warned!`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })


        }
        if (msg.content.toLowerCase().startsWith(prefix + 'suggest')) {
            var suggestion = args.slice(1).join(' ');
            if (!suggestion) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ You did not provide a suggestion!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            msg.delete();
            msg.channel.send({
                embed: {
                    color: 0x32CD32,
                    description: "<:boxouticon:459473618645286919> Your suggestion has been sent! Thanks for taking the time to review me!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            bot.channels.get('466727960624365569').send({
                embed: {
                    color: 0x32CD32,
                    description: `<:signaddicon:459473619618365441> **New Suggestion**\n\nUser: ${msg.author.tag} | ${msg.author}\n\nSuggestion: ${suggestion}`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
        }
        if (msg.content.toLowerCase().startsWith(prefix + 'feedback')) {
            var feedback = args.slice(1).join(' ');
            if (!feedback) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ You did not provide any feedback!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            msg.delete();
            msg.channel.send({
                embed: {
                    color: 0x32CD32,
                    description: "<:boxouticon:459473618645286919> Your feedback has been sent! Thanks for taking the time to review me!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            bot.channels.get('466728003397746700').send({
                embed: {
                    color: 0x32CD32,
                    description: `<:signaddicon:459473619618365441> **New Feedback**\n\nUser: ${msg.author.tag} | ${msg.author}\n\nSuggestion: ${feedback}`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
        }
        if (msg.content.startsWith(prefix + 'addemoji')) {
            if (msg.author.id != '465236540826583040') return;
            let guild = msg.guild;
            let toAdd = args[2];
            let title = args[1];

            if (!title || !toAdd) {
                return msg.channel.send('Please provide name and url for the emoji to add. Ex: >>addemoji <name> <url>');
            } else {
                guild.createEmoji(toAdd, title)
                    .then(emoji => msg.react(emoji))
                    .catch(console.log('Something went wrong.'));

            }
        }
        if (msg.content.toLowerCase().startsWith(prefix + 'chars')) {

            var charuser = args[1]

            if (!charuser)
                return msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: "⚠ You did not provide a RotMG Username to look up!",
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })
            let charapi = "http://www.tiffit.net/RealmInfo/api/user?u=" + charuser + "&f=;";

            snekfetch.get(charapi).then(r => {
                if (!r.body.error) {
                    var chars = r.body.characters
                    let finalchars = '';
                    if (!chars[0]) {
                        finalchars = 'hidden'
                    } else {

                        for (let i = 0; i < r.body.characterCount; i++) {
                            finalchars += `**${chars[i].stats_maxed}**`
                            finalchars += " "
                            finalchars += chars[i].class
                            if (r.body.characterCount < 9) {
                                for (let j in chars[i].equipment) {
                                    var charsitem = chars[i].equipment[j]
                                    if (chars[i].equipment[j] === 'Backpack') {
                                        finalchars += '<:backpack:466749819185135627>'
                                    } else {
                                        var citemname = charsitem.split(' ').slice(0, -1).join('_')

                                        var citemname = citemname.replace('-', '_')
                                        var citemname = citemname.replace('\u0027', '')
                                        var citemname = citemname.replace(':', '')
                                        if (chars[i].equipment[j] === 'Helm of the Jack-o\u0027-naut UT') var citemname = 'Helm_of_the_Jack_onaut'
                                        var citememoji = bot.emojis.find('name', citemname)
                                        finalchars += `${citememoji}`
                                    }
                                }
                            }
                            finalchars += `\n**${chars[i].fame}** <:fame:466794191494578196>`
                            finalchars += "\n"
                        }
                    }
					finalchars += `For more info about a specific class, type \`/char ${r.body.name} <class>\``
					

                    msg.channel.send({
                        embed: {
                            color: 0xFFFFFF,
                            author: {
                                name: "RotMG Characters for",
                                icon_url: bot.user.avatarURL
                            },
                            title: `**${r.body.name}**`,
                            url: `http://www.realmeye.com/player/${r.body.name}`,
                            description: `${finalchars}`,

                            timestamp: new Date(),
                            footer: {
                                icon_url: bot.user.avatarURL,
                                text: "© Droid & Lolization"
                            },
                            thumbnail: {
                                "url": "https://static.drips.pw/rotmg/wiki/Consumable/Other/Char%20Slot%20Unlocker.png"
                            }
                        }
                    });
                } else {
                    msg.channel.send
                }
            })
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
        }
        if (msg.content.toLowerCase().startsWith(prefix + 'char')) {

            if (args[0] != '/char') return;
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)

            var charname = args[1]
            var charclass = args[2]
            if (!charname)
                return msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: "⚠ You did not provide a RotMG Username to look up!",
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })
            if (!charclass)
                return msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: `⚠ You did not provide a class to look up for ${args[1]}!`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })
            let charsearchapi = "http://www.tiffit.net/RealmInfo/api/user?u=" + charname + "&f=;";
            test['charcheck'] = 'notfound'
            snekfetch.get(charsearchapi).then(c => {
                if (!c.body.error) {
                    if (!c.body.characters[0]) {
                        msg.channel.send({
                            embed: {
                                color: 0xFF0000,
                                description: "⚠ User has their characters hidden!",
                                timestamp: new Date(),
                                footer: {
                                    icon_url: bot.user.avatarURL,
                                    text: "© Droid & Co."
                                }
                            }
                        })
                        test['charcheck'] = 'found'
                        return;

                    }
                    for (i in c.body.characters) {
                        if (c.body.characters[i].class.toLowerCase().includes(charclass.toLowerCase())) {
                            var equipment = ''
                            var j;
                            for (j in c.body.characters[i].equipment) {
                                var charitem = c.body.characters[i].equipment[j]
                                if (c.body.characters[i].equipment[j] == 'Backpack') {
                                    const backpack = bot.emojis.get('466749819185135627');
                                    equipment += `${backpack}`;
                                } else {
                                    var itemname = charitem.split(' ').slice(0, -1).join('_')
                                    var itemname = itemname.replace('-', '_')
                                    var itemname = itemname.replace('\u0027', '')
                                    var itemname = itemname.replace(':', '')
                                    if (charitem == 'Helm of the Jack-o\u0027-naut UT') var itemname = 'Helm_of_the_Jack_onaut'
                                    let itememoji = bot.emojis.find('name', itemname)
                                    equipment += itememoji;
                                }
                            }
                            var acharclass = c.body.characters[i].class
                            if (acharclass.includes('Rogue')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Rogue.PNG'
                            if (acharclass.includes('Archer')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Archer_0.PNG'
                            if (acharclass.includes('Wizard')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Wizard_0.PNG'
                            if (acharclass.includes('Priest')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Priest_1.PNG'
                            if (acharclass.includes('Warrior')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Warrior_1.PNG'
                            if (acharclass.includes('Knight')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Knight_1.PNG'
                            if (acharclass.includes('Paladin')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Paladin.PNG'
                            if (acharclass.includes('Assassin')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/assassin_0.PNG'
                            if (acharclass.includes('Necromancer')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Necromancer.png'
                            if (acharclass.includes('Huntress')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Huntress.png'
                            if (acharclass.includes('Mystic')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Mystic_0.png'
                            if (acharclass.includes('Trickster')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Trickster_0.PNG'
                            if (acharclass.includes('Sorcerer')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/Sorcerer_0.png'
                            if (acharclass.includes('Ninja')) var charclasspic = 'https://www.realmeye.com/s/a/img/wiki/ninja_3.png'
                            if (acharclass.includes('Samurai')) var charclasspic = 'https://i.imgur.com/X5RhhbH.png'

                            msg.channel.send({
                                embed: {
                                    color: 0x000000,
                                    title: `${c.body.name}'s ${c.body.characters[i].class}`,
                                    url: `https://www.realmeye.com/player/${c.body.name}`,
                                    fields: [{
                                        name: "Class Quests Completed",
                                        value: `**${c.body.characters[i].class_quests_completed}**`
                                    },
                                    {
                                        name: "Fame",
                                        value: `**${c.body.characters[i].fame}** <:fame:466794191494578196>`,
                                        inline: true
                                    },
                                    {
                                        name: "Rank",
                                        value: `**#${c.body.characters[i].place}**`,
                                        inline: true
                                    },
                                    {
                                        name: "Equipment",
                                        value: `${equipment}`,
                                        inline: true
                                    },
                                    {
                                        name: 'Stats',
                                        value: `<:lifepot:467005467265204234>: **${c.body.characters[i].stats.hp}** <:manapot:467005513541091328>: **${c.body.characters[i].stats.mp}**\n<:atkpot:467005187316252683>: **${c.body.characters[i].stats.attack}** <:defpot:467005248641302539>: **${c.body.characters[i].stats.defense}**\n<:spdpot:467005297051959296>: **${c.body.characters[i].stats.speed}** <:dexpot:467005350680461322>: **${c.body.characters[i].stats.dexterity}**\n<:vitpot:467005392397008911>: **${c.body.characters[i].stats.vitality}** <:wispot:467005425439473665>: **${c.body.characters[i].stats.wisdom}**`,
                                        inline: true

                                    }
                                    ],
                                    timestamp: new Date(),
                                    footer: {
                                        icon_url: bot.user.avatarURL,
                                        text: "© Droid & Lolization"
                                    },
                                    thumbnail: {
                                        "url": charclasspic
                                    }
                                }
                            });
                            test['charcheck'] = 'found'
                        }

                    }
                } else {
                    msg.channel.send({
                        embed: {
                            color: 0xFF0000,
                            description: "⚠ User has a hidden realmeye profile, or does not exist!",
                            timestamp: new Date(),
                            footer: {
                                icon_url: bot.user.avatarURL,
                                text: "© Droid & Co."
                            }
                        }
                    })
                    test['charcheck'] = 'found'
                }

                if (test['charcheck'] == 'notfound') msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: `⚠ The specified character was not found. Either ${args[1]} does not have the class, or you have specified an incorrect class`,
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })



            })
        }





        if (msg.content.toLowerCase().startsWith(prefix + 'player')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            let ruser = args[1]
            console.log(ruser)
            let rapii = "http://www.tiffit.net/RealmInfo/api/user?u=" + ruser + "&f=;";
            let petrapii = "http://www.tiffit.net/RealmInfo/api/pets-of?u=" + ruser;


            if (!ruser)
                return msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: "⚠ You did not provide a RotMG Username to look up!",
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })
            snekfetch.get(petrapii).then(p => {
                if (!p.body.error) {
                    var abia = p.body.pets[0].ability1.type
                    var leva = p.body.pets[0].ability1.level
                    if (!p.body.pets[0].ability1.unlocked == true) {
                        var abia = ""
                        var leva = ""
                    } else {
                        var leva = leva.toString();
                    }


                    var abib = p.body.pets[0].ability2.type
                    var levb = p.body.pets[0].ability2.level
                    if (!p.body.pets[0].ability2.unlocked == true) {
                        var abib = ""
                        var levb = ""
                    } else {
                        var levb = levb.toString();
                    }

                    var abic = p.body.pets[0].ability3.type
                    var levc = p.body.pets[0].ability3.level
                    if (!p.body.pets[0].ability3.unlocked == true) {
                        var abic = ""
                        var levc = ""
                    } else {
                        var levc = levc.toString();
                    }


                    test['h'] = `${leva} ${abia} • ${levb} ${abib} • ${levc} ${abic}`





                } else {
                    if (p.body.error.includes('private')) {
                        test['h'] = p.body.error
                    } else {
                        test['h'] = 'n/a'
                    }
                }
            }) // end petinfo
            snekfetch.get(rapii).then(r => {
                if (!r.body.error) {
                    var desc1 = r.body.description[0]
                    var desc2 = r.body.description[1]
                    var desc3 = r.body.description[2]
                    var name = r.body.name
                    var stars = r.body.rank
                    var location = r.body.last_seen
                    var fame = r.body.fame
                    var count = r.body.characterCount
                    var acctfame = r.body.account_fame
                    var created = r.body.created
                    var skins = r.body.skins
                    var guildd = r.body.guild
                    var guildrank = r.body.guild_rank
                    if (count == -1) {
                        var count = 'hidden'
                    }
                    if (skins == -1) {
                        var skins = 'hidden'
                    }


                } else {
                    msg.channel.send({
                        embed: {
                            color: 0xFF0000,
                            description: "⚠ Either user doesn't exist, or has a hidden Realmeye Profile!",
                            timestamp: new Date(),
                            footer: {
                                icon_url: bot.user.avatarURL,
                                text: "© Droid & Co."
                            }
                        }
                    })
                    return;
                }

                msg.channel.send({
                    embed: {
                        color: 0xFFFFFF,
                        author: {
                            name: "Realmeye Information for",
                            icon_url: bot.user.avatarURL
                        },
                        title: `**${name}**`,
                        url: `http://www.realmeye.com/player/${name}`,
                        description: `**Description:**\n${desc1}\n${desc2}\n${desc3}`,
                        fields: [{
                            name: "Stars",
                            value: `**${stars}** ★`,
                            inline: true
                        },
                        {
                            name: "First Seen",
                            value: `*${created}*`,
                            inline: true
                        },
                        {
                            name: "Last Seen",
                            value: `*${location}*`,
                            inline: true
                        },
                        {
                            name: "Fame",
                            value: `Alive <:fame:456347834908672030>: **${fame}** | Account <:fame:456347834908672030>: **${acctfame}**`,
                            inline: true
                        },
                        {
                            name: "Guild",
                            value: `**${guildd}** | Rank: **${guildrank}**`,
                            inline: true
                        },
                        {
                            name: "Pet",
                            value: `${test['h']}`,
                            inline: true
                        }
                        ],
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid"
                        },
                        thumbnail: {
                            "url": "https://www.realmeye.com/s/c9/img/eye-big.png"
                        }
                    }
                });

            }) //endrealmeyechar
        } //end player
        if (msg.content.toLowerCase().startsWith(prefix + 'petfoodlist')) {
            console.log(`${args[0]} used in ${msg.guild} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            snekfetch.get('http://www.tiffit.net/RealmInfo/api/nexusitems?c=pet-food').then(f => {
                var i;
                var petfoodlist = "";
                for (i in f.body.item) {
                    petfoodlist += `**${f.body.item[i].name}**, `
                }
                msg.channel.send({
                    embed: {
                        color: 0xEAC70D,
                        author: {
                            name: "List of Available Pet Foods"
                        },
                        description: petfoodlist,
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })

            })
        }
        if (msg.content.toLowerCase().startsWith(prefix + 'keylist')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            snekfetch.get('http://www.tiffit.net/RealmInfo/api/nexusitems?c=keys').then(s => {
                var i;
                var keylist = "";
                for (i in s.body.item) {

                    keylist += `**${s.body.item[i].name}**`
                    keylist += ", "
                }
                msg.channel.send({
                    embed: {
                        color: 0xEAC70D,
                        author: {
                            name: "List of Available Keys"
                        },
                        description: keylist,
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })

            });





        }
        if (msg.content.toLowerCase().startsWith(prefix + 'petfood')) {
            if (msg.content.includes('petfoodlist')) return;
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            test['petfoodcheck'] = 'notfound'
            var petfoodsearch = args.slice(1).join(' ');
            if (!petfoodsearch) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a pet food name to search for!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            snekfetch.get('http://www.tiffit.net/RealmInfo/api/nexusitems?c=pet-food').then(s => {
                for (i in s.body.item) {
                    var currpfname = s.body.item[i].name
                    if (currpfname.toLowerCase().includes(petfoodsearch.toLowerCase())) {
                        msg.channel.send({
                            embed: {
                                color: 0xEAC70D,
                                author: {
                                    name: "Pet Food Searcher"
                                },
                                fields: [{
                                    name: "Item Found! <a:petfood:476168086215458817>",
                                    value: `${s.body.item[i].name}`
                                },
                                {
                                    name: "Cheapest Location",
                                    value: `${s.body.item[i].price} <:coin:463847187957415946> at ${s.body.item[i].cheapest_on}`,
                                    inline: true
                                },
                                {
                                    name: "Supply",
                                    value: `${s.body.item[i].quantity} left`,
                                    inline: true
                                },
                                {
                                    name: "Time Left",
                                    value: `${s.body.item[i]['Time Left']} Minutes`
                                }
                                ],
                                timestamp: new Date(),
                                footer: {
                                    icon_url: bot.user.avatarURL,
                                    text: "© Droid"
                                },
                                thumbnail: {
                                    "url": "https://i.imgur.com/MG2ZIuQ.gif"
                                }
                            }
                        });
                        test['petfoodcheck'] = 'found'
                        return
                    }
                }
                if (test['petfoodcheck'] == 'notfound') return msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: "⚠ The pet food with the specified name was **not found**. Either the item is not currently for sale, or you have provided incorrect details!",
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })


            })
        }
        if (msg.content.toLowerCase().startsWith(prefix + 'key')) {

            // for makeing sure key cmd doesnt cross with keys cmd
            if (msg.content.toLowerCase().startsWith(prefix + 'keylist')) return;
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)


            test['keycheck'] = 'notfound'
            var keysearch = args.slice(1).join(' ');
            if (!keysearch) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a key type to search for!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            let keyapi = 'http://www.tiffit.net/RealmInfo/api/nexusitems?c=keys'
            snekfetch.get(keyapi).then(k => {
                for (i in k.body.item) {
                    var currkey = k.body.item[i].name
                    if (currkey.toLowerCase().includes(keysearch.toLowerCase())) {
                        msg.channel.send({
                            embed: {
                                color: 0xEAC70D,
                                author: {
                                    name: "Key Searcher"
                                },
                                fields: [{
                                    name: "Key Found! <:myskey:466286634590142464>",
                                    value: `${k.body.item[i].name}`
                                },
                                {
                                    name: "Cheapest Location",
                                    value: `${k.body.item[i].price} <:coin:463847187957415946> at ${k.body.item[i].cheapest_on}`,
                                    inline: true
                                },
                                {
                                    name: "Supply",
                                    value: `${k.body.item[i].quantity} left`,
                                    inline: true
                                },
                                {
                                    name: "Time Left",
                                    value: `${k.body.item[i]['Time Left']} Minutes`
                                }
                                ],
                                timestamp: new Date(),
                                footer: {
                                    icon_url: bot.user.avatarURL,
                                    text: "© Droid"
                                },
                                thumbnail: {
                                    "url": "https://static.drips.pw/rotmg/wiki/Consumable/Keys/Diamond%20Mystery%20Key.png"
                                }
                            }
                        });
                        test['keycheck'] = 'found'
                        return;
                    }

                }
                if (test['keycheck'] == 'notfound') return msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: "⚠ The Key with the specified name was **not found**. Either the key is not currently for sale, or you have provided incorrect details!",
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })


            })

        }
        if (msg.content.toLowerCase().startsWith(prefix + 'egg')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            var rarity = args[1]
            var type = args[2]
            if (!rarity) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a pet rarity.\n```asciidoc\n= Accepted Rarity Types =\n[Uncommon] [Rare] [Legendary]\n```",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (!type) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a pet family.\n```asciidoc\n= Accepted Family Types =\n[Feline] [Canine] [Avian] [Exotic] [Farm] [Woodland] [Reptile] [Insect] [Penguin] [Aquatic] [Spooky] [Humanoid] [????] [Automaton] [Mystery]\n```",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })

            let eggapi = 'http://www.tiffit.net/RealmInfo/api/nexusitems?c=pets'
            test['eggcheck'] = 'notfound'
            snekfetch.get(eggapi).then(p => {
                for (i in p.body.item)
                    if (p.body.item[i].name.toLowerCase().includes(`${rarity.toLowerCase()} ${type.toLowerCase()}`)) {
                        msg.channel.send({
                            embed: {
                                color: 0xFFD0E7,
                                author: {
                                    name: "Egg Searcher"
                                },
                                fields: [{
                                    name: "Egg Found! <a:eggs:463883553663614978>",
                                    value: `${p.body.item[i].name}`
                                },
                                {
                                    name: "Cheapest Location",
                                    value: `${p.body.item[i].price} <:coin:463847187957415946> at ${p.body.item[i].cheapest_on}`,
                                    inline: true
                                },
                                {
                                    name: "Supply",
                                    value: `${p.body.item[i].quantity} left`,
                                    inline: true
                                },
                                {
                                    name: "Time Left",
                                    value: `${p.body.item[i]['Time Left']} Minutes`
                                }
                                ],
                                timestamp: new Date(),
                                footer: {
                                    icon_url: bot.user.avatarURL,
                                    text: "© Droid"
                                },
                                thumbnail: {
                                    "url": "https://i.imgur.com/GlWHeLf.gif"
                                }
                            }
                        });
                        test['eggcheck'] = 'found'

                    }
                if (test['eggcheck'] == 'notfound') return msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: "⚠ The Egg with the specified details was **not found**. Either the egg is not currently for sale, or you have provided incorrect details!\n```asciidoc\n= Accepted Family Types =\n[Feline] [Canine] [Avian] [Exotic] [Farm] [Woodland] [Reptile] [Insect] [Penguin] [Aquatic] [Spooky] [Humanoid] [????] [Automaton] [Mystery]\n```\n```asciidoc\n= Accepted Rarity Types =\n[Uncommon] [Rare] [Legendary]\n```",
                        timestamp: new Date(),
                        footer: {
                            icon_url: bot.user.avatarURL,
                            text: "© Droid & Co."
                        }
                    }
                })


            })

        }

        if (msg.content.toLowerCase().startsWith(prefix + 'backpack')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            let backpackapi = 'http://www.tiffit.net/RealmInfo/api/nexusitems?c=misc'

            snekfetch.get(backpackapi).then(b => {
                for (i in b.body.item) {
                    if (b.body.item[i].name == "Backpack") {
                        var cheapest = b.body.item[i].cheapest_on
                        var price = b.body.item[i].price
                        var quantity = b.body.item[i].quantity
                        var timeleft = b.body.item[i]['Time Left']
                        msg.channel.send({
                            embed: {
                                color: 0xC76520,
                                author: {
                                    name: "Cheapest Backpack"
                                },
                                fields: [{
                                    name: "Location",
                                    value: `${cheapest}`
                                },
                                {
                                    name: "Price",
                                    value: `${price} <:coin:463847187957415946>`
                                },
                                {
                                    name: "Supply",
                                    value: `${quantity} left`
                                }
                                ],
                                timestamp: new Date(),
                                footer: {
                                    icon_url: bot.user.avatarURL,
                                    text: "© Droid"
                                },
                                thumbnail: {
                                    "url": "https://static.drips.pw/rotmg/wiki/Consumable/Other/Backpack.png"
                                }
                            }
                        });
                    }
                }





            })

        }
        if (msg.content.toLowerCase().startsWith(prefix + 'gmembers')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            var argss = msg.content.split(" ").splice(1)
            let guild = argss.slice(0).join(' ');
            if (!guild) {
                msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: "⚠ You did not provide a Guild Name to look up!",
                        timestamp: new Date(),
                        footer: {
                            text: "© Droid & Co."
                        }
                    }
                })
                return;
            }
            console.log(guild)
            let gapi = "http://www.tiffit.net/RealmInfo/api/guild?g=" + guild + "&fe"
            snekfetch.get(gapi).then(g => {

                if (!g.body.error) {
                    var founders = ""
                    var leaders = ""
                    var officers = ""
                    var members = ""
                    var initiates = ""

                    for (i in g.body.members) {
                        if (!g.body.members[i].guild_rank) continue;
                        if (g.body.members[i].guild_rank == "Founder") {
                            founders += `${g.body.members[i].name}`
                            founders += ", "
                        }
                        if (g.body.members[i].guild_rank == "Leader") {
                            leaders += `${g.body.members[i].name}`
                            leaders += ", "
                        }
                        if (g.body.members[i].guild_rank == "Officer") {
                            officers += `${g.body.members[i].name}`
                            officers += ", "
                        }
                        if (g.body.members[i].guild_rank == "Member") {
                            members += `${g.body.members[i].name}`
                            members += ", "
                        }
                        if (g.body.members[i].guild_rank == "Initiate") {
                            initiates += `${g.body.members[i].name}`
                            initiates += ", "
                        }

                    }

                    msg.channel.send({
                        embed: {
                            color: 0xFFFFFF,
                            author: {
                                name: "Guild Members of",
                                icon_url: bot.user.avatarURL
                            },
                            title: `**${g.body.name}**`,
                            description: `**Founder(s):** ${founders}\n**Leaders:** ${leaders}\n**Officers:** ${officers}\n**Members:** ${members}\n**Initiates:** ${initiates}`,

                            timestamp: new Date(),
                            footer: {
                                icon_url: bot.user.avatarURL,
                                text: "© Droid"
                            }
                        }
                    });



                } else {
                    msg.channel.send({
                        embed: {
                            color: 0xFF0000,
                            description: "⚠ Guild not found!\nNote: *Guild Names are CASE-SENSITIVE*",
                            timestamp: new Date(),
                            footer: {
                                text: "© Droid & Co."
                            }
                        }
                    })

                }
            })
        }
        if (msg.content.toLowerCase().startsWith(prefix + 'guild')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            var argss = msg.content.split(" ").splice(1)
            let guild = argss.slice(0).join(' ');
            if (!guild) {
                msg.channel.send({
                    embed: {
                        color: 0xFF0000,
                        description: "⚠ You did not provide a Guild Name to look up!",
                        timestamp: new Date(),
                        footer: {
                            text: "© Droid & Co."
                        }
                    }
                })
                return;
            }
            console.log(guild)
            let guildapi = "http://www.tiffit.net/RealmInfo/api/guild?g=" + guild + "&fe"
            snekfetch.get(guildapi).then(g => {
                if (!g.body.error) {
                    var guildname = g.body.name
                    var membercount = g.body.memberCount
                    var membercount = membercount.toString()
                    var characters = g.body.characters
                    var characters = characters.toString()
                    var guildfame = g.body.fame.amount
                    var guildfame = guildfame.toString()
                    var worldrank = g.body.fame.rank
                    var activeserver = g.body.most_active.server
                    var serverrank = g.body.most_active.rank





                    msg.channel.send({
                        embed: {
                            color: 0xFFFFFF,
                            author: {
                                name: "Guild Information for"
                            },
                            title: `**${guildname}**`,
                            fields: [{
                                name: "Members",
                                value: `**${membercount}**`,
                                inline: true
                            },
                            {
                                name: "Guild <:fame:456347834908672030>",
                                value: `*${guildfame}*`,
                                inline: true
                            },
                            {
                                name: "Active Server",
                                value: `*${activeserver}*`,
                                inline: true
                            },
                            {
                                name: "Ranks 📈",
                                value: `Server: **${serverrank}** | World: **${worldrank}**`,
                                inline: true
                            },
                            {
                                name: "Count Stats",
                                value: `# of Members **${membercount}** | # of Characters: **${characters}**`,
                                inline: true
                            }

                            ],
                            timestamp: new Date(),
                            footer: {
                                icon_url: bot.user.avatarURL,
                                text: "© Droid"
                            }
                        }
                    });

                } else {
                    var guildsuggestions = '**Suggested Names:** '
                    if (g.body.suggestions.length >= 10) {

                        for (i = 0; i <= 10; i++) {
                            guildsuggestions += `\n ${g.body.suggestions[i]}`
                        }
                    } else {
                        for (i in g.body.suggestions) {
                            guildsuggestions += `\n ${g.body.suggestions[i]}`
                        }

                    }
                    msg.channel.send({
                        embed: {
                            color: 0xFF0000,
                            description: `⚠ Guild not found!\nNote: *Guild Names are CASE-SENSITIVE* \n ${guildsuggestions}`,
                            timestamp: new Date(),
                            footer: {
                                text: "© Droid & Co."
                            }
                        }
                    })
                }
            })
        } // end guild
        if (msg.content.toLowerCase().startsWith(prefix + 'partners')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            msg.channel.send({
                embed: {
                    color: 0x000000,
                    thumbnail: {
                        url: 'https://images-ext-2.discordapp.net/external/NaDVJCA1t67JzJ5ipmO-QBHdKgsfSS-RK-5_nsnUrKc/https/is1-ssl.mzstatic.com/image/thumb/Music128/v4/52/2d/47/522d47fe-79f3-a5cb-f831-e5116aeea118/source/1200x630bb.jpg'
                    },
                    description: `__**Partners**__\n\n**[Deca Debrief](https://itunes.apple.com/us/podcast/deca-debrief/id1418676717)** is a podcast dedicated to covering news, updates, events, and the community of RotMG. Each week they bring on youtubers, UGC creators, and developers to discuss the current state of the game, where it's headed, and learn more about them Go show them some love!.`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })

        }
        if (msg.content.toLowerCase().startsWith(prefix + 'invite')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "Click [here](https://discordapp.com/oauth2/authorize?client_id=480025338420920330&permissions=346112&scope=bot) to invite me to your server! Please leave the default permissions on!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Lolization"
                    }
                }
            })
        }
        //[Guill's Support Server](https://discord.gg/3Gby6sT)
        if (msg.content.toLowerCase().startsWith(prefix + 'support')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "Click [here](https://discord.gg/3Gby6sT) to join the support server!",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
        }

        if (msg.content.toLowerCase().startsWith(prefix + 'info')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            msg.channel.send({
                embed: {
                    color: 0x000000,
                    author: {
                        name: bot.user.username,
                        icon_url: bot.user.avatarURL
                    },
                    description: "Guill is discord bot for RotMG Players to use for convenience. It makes fetching user and guild info easier and presentable, and overall improves players' experience with the game!\nTo see what commands this bot has to offer, type `/help` in a channel!\nTo invite this bot to your server, type `/invite`\n\n**Official Website:** https://guill.glitch.me/",
                    fields: [{
                        name: "Framework",
                        value: "Discord.js ⇨ [Documentation](https://discord.js.org/#/)"
                    },
                    {
                        name: "Language",
                        value: "JavaScript ⇨ [jsOfficial](https://www.javascript.com/)"
                    },
                    {
                        name: "Developer",
                        value: "`~Droid~#5799` ⇨ [Realmeye Profile](https://www.realmeye.com/player/droidmxbro) | [Github](https://github.com/droidmx)"
                    },
                    {
                        name: "Support Server",
                        value: "Invite Link ⇨ [Guill's Support Server](https://discord.gg/3Gby6sT)"
                    },
                    {
                        name: "Special Thanks to",
                        value: "`XkijuX#6667` for designing the `/serverinfo` command"
                    }


                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })

        }
        if (msg.content.toLowerCase().startsWith(prefix + '8ball')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            var sayings = ["It is certain",
                "It is decidedly so",
                "Without a doubt",
                "Yes, definitely",
                "You may rely on it",
                "As I see it, yes",
                "Most likely",
                "Outlook good",
                "Yes",
                "Signs point to yes",
                "Reply hazy try again",
                "Ask again later",
                "Better not tell you now",
                "Cannot predict now",
                "Concentrate and ask again",
                "Don't count on it",
                "My reply is no",
                "My sources say no",
                "Outlook not so good",
                "Very doubtful"
            ];
            var question = args.slice(1).join(' ');
            if (!question) return msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please ask a question for the :8ball:",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            var result = Math.floor((Math.random() * sayings.length) + 0);
            msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: `❓ ${question}\n\n:8ball: ${sayings[result]}`,
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
        }
        if (msg.content.toLowerCase().startsWith(prefix + 'ping')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            msg.channel.send("Pinging... :signal_strength:").then(sent => {
                sent.edit(`:ping_pong: Pong! | Time Taken: ${sent.createdTimestamp - msg.createdTimestamp}ms`)
            })
        }
        if (msg.content.toLowerCase().startsWith(prefix + 'help')) {
            console.log(`${args[0]} used in ${msg.guild.name} by ${msg.author.username}`)
            bot.channels.get('466815252131086342').send(`${args[0]} used in ${msg.guild.name} by ${msg.author.username} \`[${moment().format("LT")}]\``)
            var param = args[1]
            if (!param) return msg.channel.send({
                embed: {
                    color: 0x000000,
                    fields: [{
                        name: "Commands",
                        value: "To get help for a specific command, use `/help <command>`"
                    },
                    {
                        name: "<a:oryx:466283523691642890> RotMG",
                        value: "```css\n(player) (chars) (char) (guild) (gmembers) (backpack) (egg) (key) (keylist) (petfood) (petfoodlist)```"
                    },
                    {
                        name: "<a:finaldundie:466655044956061706> Fun",
                        value: "```css\n(8ball) (ping)```"
                    },
                    {
                        name: "<:banhammer:471005730170863637> Moderation",
                        value: '```css\n(ban) (kick) (warn)```'
                    },
                    {
                        name: "<:terminalicon:459473619735674890> Development",
                        value: "```css\n(suggest) (feedback) (support)```"
                    },
                    {
                        name: "<:info:459473619530285057> Information",
                        value: "```css\n(help) (info) (stats) (serverinfo) (invite) (partners)```"
                    }


                    ],
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'player') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Player Command**\nFunction: Gets a player's data through Realmeye\nUsage: `/player <Rotmg Username>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'support') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Support Command**\nFunction: Provides an invite link for the support server!\nUsage: `/support`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'ban') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Ban Command**\nFunction: Bans a user with a specified reason, and notifies the user of their ban with the provided reason!\nUsage: `/ban @user <reason>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'warn') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Warn Command**\nFunction: Warns a user with a specified reason!\nUsage: `/warn @user <reason>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'kick') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Kick Command**\nFunction: Kicks a user with a specified reason, and notifies the user of their kick with the provided reason!\nUsage: `/kick @user <reason>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'suggest') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Suggestion Command**\nFunction: Sends your suggestion to the support server for review!\nUsage: `/suggest <suggestion>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'feedback') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Feedback Command**\nFunction: Sends your feedback to the support server for review!\nUsage: `/feedback <feedback>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'keylist') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Keys Command**\nFunction: Sends a list of keys available for purchase at the time.\nUsage: `/keylist`\n\nNote: Use `/key <name of key>` for more information on the particular key",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'petfoodlist') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Pet Food List Command**\nFunction: Sends a list of pet foods available for purchase at the time.\nUsage: `/petfoodlist`\n\nNote: Use `/key <name of key>` for more information on the particular key",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'ping') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Ping Command**\nFunction: Checks if bot is online and returns the signal delay.\nUsage: `/ping`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == '8ball') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**8ball Command**\nFunction: Asks the magical <a:ult8ball:466317137951326208> a question!\nUsage: `/8ball <question>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'stats') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Statistics Command**\nFunction: Get some statistics about the bot and it's current usage!\nUsage: `/stats`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'serverinfo') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Server-Info Command**\nFunction: Show some information about the server you're in!\nUsage: `/serverinfo`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'backpack') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Backpack Command**\nFunction: Shows the cheapest place to buy a Backpack and more\nUsage: `/backpack`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'char') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Character Search**\nFunction: Searches for the specified user's specified character and provides information\nUsage: `/char <RotMG Username> <Class Name>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'chars') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Character List**\nFunction: Shows a player's characters\nUsage: `/chars <Rotmg Username>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'gmembers') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Guild Members Command**\nFunction: Gets a list of members of the specified guild\nUsage: `/gmembers <Guild Name>`\nNote: *Guild name is case-sensitive*",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'guild') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Guild Command**\nFunction: Gets a guild's data through Realmeye\nUsage: `/guild <Guild Name>`\nNote: *Guild name is case-sensitive*",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'invite') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Invite Command**\nFunction: Sends an invite link for the bot\nUsage: `/invite`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'key') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Key Searcher**\nFunction: Searches for a key with the specified name and provides information on sale location\nUsage: `/key <key name>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'petfood') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Pet Food Searcher**\nFunction: Searches for a pet food with the specified name and provides information on sale location\nUsage: `/petfood <pet food name>`",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            if (param == 'egg') return msg.channel.send({
                embed: {
                    color: 0x000000,
                    description: "**Egg Searcher**\nFunction: Searches for the egg with the specified details and provides information for the egg!\nUsage: `/egg <rarity> <family>`\n```asciidoc\n= Accepted Family Types =\n[Feline] [Canine] [Avian] [Exotic] [Farm] [Woodland] [Reptile] [Insect] [Penguin] [Aquatic] [Spooky] [Humanoid] [????] [Automaton] [Mystery]\n```\n```asciidoc\n= Accepted Rarity Types =\n[Uncommon] [Rare] [Legendary]\n```",
                    timestamp: new Date(),
                    footer: {
                        icon_url: bot.user.avatarURL,
                        text: "© Droid & Co."
                    }
                }
            })
            msg.channel.send({
                embed: {
                    color: 0xFF0000,
                    description: "⚠ Please provide a valid command name.\nType `/help` for a list of commands",
                    timestamp: new Date(),
                    footer: {
                        text: "© Droid & Co."
                    }
                }
            })

        }
        talkedRecently.add(msg.author.id);
        setTimeout(() => {
            // Removes the user from the set after a minute
            talkedRecently.delete(msg.author.id);
            console.log(`${msg.author.username} removed from cooldown`)
        }, 2000);
    }
}) // end message handler
bot.login(process.env.BOT_TOKEN)
