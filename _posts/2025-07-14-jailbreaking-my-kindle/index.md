---
title: How and why I jailbroke my Kindle
date: 2025-07-14 00:00:00.00 -8
anthology:
  name: Kindle Modding
  type: chapter
  chapter: 1
  summary: Jailbreaking my Kindle
categories:
  - hacking
---

{% from '_macros/blog-gallery.html.twig' import image_gallery %}

For years, I had been searching for the "perfect e-ink reader" that met all of my niche needs and wants. I wanted something with integration to [calibre](https://calibre-ebook.com/), the ability to download and read RSS feeds, and, lastly, the ability to connect to cloud storage, such as Google Drive, where I host my PDFs. These seem like a niche set of features, and honestly, they are. However, this is what I've always wanted. I conducted my research and evaluated numerous e-ink readers, including Boox, Kobo, the new Kindle, Nook, ReMarkable, and others. None of them checked all the boxes, and all came with extreme vendor lock-in or had virtually no developer community behind them. Sure, I've got an iPad that can accomplish all those features and more, but it has a lot more functionality than I need when I want to read without distractions.

I recently discovered the Kindle jailbreaking community and was reminded of my teen years when I was active in the iOS jailbreaking community. The level of freedom I had over my device at the time was something I would love to have over my Kindle. With Amazon recently running [a big book sale that "coincidentally" overlapped with Independent Bookstore Day](https://techcrunch.com/2025/04/26/amazons-big-book-sale-just-happens-to-overlap-with-independent-bookstore-day/?guccounter=1), I decided it was time to say "fuck you" to Amazon and part ways as much as I can.

## Why am I jailbreaking my Kindle?

I have recently worked long hours organizing all my ebooks into a single library using Calibre, with the goal of eventually syncing them to my Kindle. Here's the tricky part, for years, I had been buying ebooks from Amazon, and while they did make the ecosystem incredibly user-friendly for the majority of the population, I felt limited due to the following:

1. As of February 26, 2025, Amazon has discontinued support for the "Download & Transfer via USB" functionality. This means it is now significantly more tedious for you to download copies of the ebooks **you** have bought. In the past, I have had Amazon delist ebooks from their online stores, and as a result, I lost access to them on my Kindle, as I can no longer search for them. Thankfully, I was in the habit of always downloading a copy of those ebooks, but what if I hadn't? I might have lost that digital book even though I **bought** it.
2. I never thought I would be writing this, but with the direction my country, the United States, is heading regarding censorship, I did not want to remain at the mercy of Amazon to dictate which books I've **purchased**, and still be allowed to read.
3. The only way I can transfer books to my Kindle wirelessly is by emailing the file to my Kindle email address, which Amazon manages. What's stopping Amazon from censoring the books I send to them to deliver to my Kindle?
4. My Kindle Paperwhite, 3rd generation, from 2015, is considered "end of life," meaning I no longer receive updates from Amazon. According to Amazon, my Kindle is considered no different from a paperweight. Why would I trade in, my perfectly functional and in good condition device for a new device that has even more restrictions placed on it? It's wasteful consumerism. If Amazon has stopped developing for my Kindle, let's turn to the open source community of nerds that hasn't.

Fuck Amazon! Let's jailbreak my 7th generation 2015 Kindle Paperwhite (aka `PW3`).

## The Jailbreaking Process

First off, the jailbreaking process is nowhere near as simple as it was in my iOS days, where you could download an app on your computer, press a single button, and wait. That's not to say it's difficult or impossible; it's just a more involved process. A lot of very smart nerds who share the same sentiment about breathing new life into their abandoned devices have invested considerable effort in simplifying the process as much as possible.

Thank you to the awesome community behind [Kindle Modding](https://kindlemodding.org/) for writing all the tutorials and documentation I used to jailbreak my Kindle. This would not have been possible without [HackerDude](https://www.mobileread.com/forums/member.php?u=330416)'s WinterBreak exploit that I was able to get working.

### The Prerequisites

- A computer; it's not possible to jailbreak your Kindle just from the device itself
- Your Kindle **must** be registered with Amazon (unfortunately)
- You must have a saved Wi-Fi connection on your Kindle, and be ready to connect to that Wi-Fi during the jailbreak process

### Run the Jailbreak Exploit

The first step is to run an exploit, which allows us to remove security restrictions on the Kindle; this is known as "jailbreaking."

1. Download the [latest release of the WinterBreak jailbreak](https://github.com/KindleModding/WinterBreak/releases/latest/download/WinterBreak.tar.gz) on your computer.
2. Turn on airplane mode on your Kindle.
3. Reboot your Kindle.
4. After rebooting, connect the Kindle to the computer via USB. Extract WinterBreak and copy over the contents onto the Kindle (including the hidden dot files!). Replace any files that may already exist.
5. Eject your Kindle from the computer.
6. Open the Kindle Store by clicking on the cart icon. It'll prompt you to turn off Airplane mode, do it. Once the store loads, the Mesquito hack will be displayed. Click to run it.
   {{ image_gallery([
     {
        alt: "Kindle screenshot of WinterBreak's \"click to run\" prompt",
        caption: "The Kindle Store serves as our environment for executing code, so we run the Mesquito exploit from here.",
        src: "./winterbreak-click-to-run.png",
     }
   ]) }}
7. Wait for a few seconds, and then console text will appear in the upper left corner of the display. At this point, turn airplane mode back on and install the hotfix to persist this jailbreak across reboots.
   {{ image_gallery([
     {
        alt: "Jailbreak process log text displaying on the upper left part of the screen",
        caption: "When the jailbreak process is complete, the top left of your Kindle will display Terminal-like log message.",
        src: "./jailbreak-successful.png",
     }
   ]) }}

### Persisting the Jailbreak (aka "Installing the Hotfix")

The next step is to persist this jailbreak across reboots and updates; a Kindle update referred to as a "hotfix" is needed to accomplish this.

1. Download the [update `.bin` file from GitHub](https://github.com/KindleModding/Hotfix/releases/latest/download/Update\_hotfix\_universal.bin), this file is what's known as the "hotfix."
2. Plug in the Kindle and copy the `.bin` file to the device's root directory. If there are any other `.bin` files on the device already, delete them first.
3. Go to your Kindle settings, then click the three-dot menu, and select "Update your Kindle." Confirm the installation.
   {{ image_gallery([
     {
        alt: "Dropdown menu with \"Update your Kindle\" option",
        caption: "From your Kindle settings, you will apply the hotfix as an \"update\" to your Kindle software.",
        src: "update-your-kindle.png",
     }
   ]) }}
4. After the Kindle has rebooted, the hotfix is now installed and needs to be executed on the device. A new "ebook" is displayed in your device's library called "Run Hotfix." Open that book to run the process.
5. Do **not** delete the hotfix ebook, it is necessary to run it every time there's an update.

### Install KUAL and MRPI

Now that our Kindle is fully jailbroken, we can run whatever code or applications we want. Similarly to how the hotfix in the previous step created a fake ebook that, when opened, executed code, we need to do the same for our other applications so that we can launch them from the Kindle UI. This is where the Kindle Unified Application Launcher, or KUAL, comes in to solve that need.

1. Download [KUAL for devices released in 2012 or after](https://kindlemodding.org/jailbreaking/post-jailbreak/installing-kual-mrpi/Update\_KUALBooklet\_ALLDEVICES\_KS2\_install.bin), or [KUAL for legacy devices (pre-2012)](https://storage.gra.cloud.ovh.net/v1/AUTH\_2ac4bfee353948ec8ea7fd1710574097/mr-public/KUAL/KUAL-v2.7.37-gfcb45b5-20250419.tar.xz).
2. Download [the MobileRead Package Installer (MRPI)](https://fw.notmarek.com/khf/kual-mrinstaller-khf.tar.xz) to simplify the installation of update packages (remember the .bin file from the previous step?).
3. Connect your Kindle to your computer.
4. Extract the MRPI contents and copy over/merge the `extensions` and `mrpackages` folders to your Kindle.
5. Copy over the KUAL `.bin` file to the root of the device.
6. Eject and unplug your Kindle.
7. In the Kindle's search bar, type `;log mrpi`.
8. Go to your Kindle settings, then click the three dot menu, and select "Update your Kindle." Confirm the installation.
9. After your Kindle reboots, a KUAL ebook should be located in your library.

### Disable OTA Updates

My Kindle Paperwhite 3rd gen is EOL and no longer receives updates, but let's disable OTA anyway to be safe. My Kindle is stuck at firmware 5.16.2.1.1, so I need to install `renameotabin`.

1. Download [`renameotabin`](https://www.mobileread.com/forums/showpost.php?p=4076733\&postcount=25).
2. Connect the Kindle to your computer and copy the `renameotabin` folder into the `extensions` folder.
3. Eject and unplug the Kindle.
4. Open the KUAL ebook and select "Rename OTA Binaries" from the menu. Then, proceed to select "Rename."
   1. If you need to restore, downgrade, or otherwise manage your Kindle through official methods, select `Restore` before proceeding.

### Restoring the Store

I'm not sure how I feel about having the Kindle Store enabled again, but I've re-enabled its access, just in case I need it. I may turn it off at a later point.

1. Delete `.active_content_sandbox` from the root of the device.
2. Eject and unplug.
3. Reboot your device.

### Installing KOReader

KOReader is a replacement for Kindle's default e-Reader software, and honestly, it has so much more. This is the biggest reason why I jailbroke my Kindle.

1. Download [the latest version of KOReader from GitHub](https://github.com/koreader/koreader/releases)
2. If your Kindle was released before 2012, use the "legacy" Kindle download. Otherwise, download the non-"legacy" version.
3. Connect the Kindle to the computer.
4. Extract the contents of the KOReader archive and copy/merge over all the folders onto the Kindle's root.
5. Launch KOReader from KUAL; prefer to use "Start KOReader" because the "no framework" version is largely intended for older devices. The ASAP variant is a faster startup time for KOReader, but I see no need to use it since it loads fast for me.

## Setting Up SSH

I'm trying to avoid having a micro-USB cable on my desk; I already have one at my charging station. Every other device that's on my desk supports either wireless charging or USB-C; I like to avoid having too many cables. I enabled SSH on my Kindle so that I could mount it wirelessly on my Mac; i.e., I can drag and drop files from my SFTP client wirelessly.

Within KOReader, I navigate to the gear icon in the top menu bar, then select `Network`, followed by `SSH Server`.

{{ image_gallery([
  {
    alt: "KOReader's Gear menu",
    caption: "In KOReader's Gear menu, select the \"Network\" submenu that is the third item from the top.",
    src: "./menu-tools.png",
  },
  {
    alt: "KOReader's Network menu",
    caption: "Within the Network menu, select the \"SSH server\" submenu that is the last item of the menu.",
    src: "./menu-tools-network.png",
  }
]) }}

I'm setting up my SSH key on the Kindle so that I can connect to it securely.

1. I first need to temporarily enable "Login without password (DANGEROUS)" on my Kindle. This will allow me to connect to the Kindle via SSH with a blank password.
2. Then, I will start the SSH server by clicking on the "SSH Server" menu item. You will get a pop-up on your Kindle that displays its IP address; I need it for the next step.
   {{ image_gallery([
     {
        alt: "Pop-up notification confirming KOReader's SSH server started successfully",
        caption: "When the SSH server has started, you'll receive a success notification with two bits of important information: the Kindle's IP address and KOReader's SSH port.",
        src: "./ssh-server-started.png",
     }
   ]) }}
3. I can now connect via SSH. The connection details are as follows,
   - Host: Your Kindle's IP address from step 2, for me, it was 192.168.12.120.
   - Username: root
   - Password: &lt;leave empty&gt;
4. My SSH command looked like so,

   ```
   $ ssh root@192.168.12.120 -p 2222
   #################################################
   #  N O T I C E  *  N O T I C E  *  N O T I C E  #
   #################################################
   Rootfs is mounted read-only. Invoke mntroot rw to
   switch back to a writable rootfs.
   #################################################
   [root@kindle root]# mntroot rw
   ```

Upon connecting, I'm greeted by this notice that essentially tells me, "consider your current session as read-only, if you want to make edits to any files, (which we do), run this command." I want to be able to save my public key on the Kindle so that we can use it to SSH in; therefore we need to make the filesystem writable.

```
# mntroot rw
system: I mntroot:def:Making root filesystem writeable
```

Now I need to find my Kindle's `authorized_keys` file, which is located at, `/mnt/us/koreader/settings/SSH/authorized_keys`. Like most light-weight systems, the only text editor available is `vi` so be sure to know how to exit once you're done.

Paste your public key into your `authorized_keys` and exit your SSH session. Go back to your Kindle and shut down your SSH server. Earlier, I enabled "Login without password." Now, it's time for me to turn it off, and I should be able to log in with my SSH key.

To verify that updating my `authorized_keys` worked correctly, I'll add a `-v` to my SSH command and read the logs of which public key is accepted by my Kindle (I have several keys on my computer).

```
$ ssh root@192.168.12.120 -p 2222 -v

... lots of output ...

debug1: Offering public key: /Users/allejo/.ssh/id_ed25519 ED25519 SHA256:9S2ld7G9EZXqIbqXKvosAKA74Xj1rDaOP9Gpx4pvdIQ
debug1: Server accepts key: /Users/allejo/.ssh/id_ed25519 ED25519 SHA256:9S2ld7G9EZXqIbqXKvosAKA74Xj1rDaOP9Gpx4pvdIQ
Enter passphrase for key '/Users/allejo/.ssh/id_ed25519':
```

The "Server accepts key:" line is what we're looking for. This means that my Kindle recognizes my SSH key and will allow me to log in once I unlock my key. Now, I can use my favorite SFTP client to connect to my Kindle securely. If I want to see the equivalent of my Kindle's "root," i.e., the filesystem I see when I connect my Kindle to my computer with a micro-USB cable, that's mounted at `/mnt/us/`.

## Screenshots

Another feature I was oddly excited for was the ability to take screenshots! Okay, so Kindles have been able to [take screenshots since at least 2020](https://www.toptrix.net/2020/05/most-useful-kindle-tools-services.html), but it's such a bad experience. The gesture isn't tricky, but for the life of me, I cannot tap both corners at the same time. And let's say I do manage to do so by chance; the screen flashes white, and that's it. But you know what else that looks like? Your Kindle repainting its entire screen. There's no notification at all that my screenshot was successful.

But KOReader gets it right! Its default gesture for screenshots is a long one-finger diagonal swipe. I swipe from a top corner to its diagonal bottom corner, and I receive a notification that my screenshot was taken.

{{ image_gallery([
  {
    alt: "Screenshot notification on KOReader displayed as a popup",
    caption: "KOReader displays a notification when you successfully take a screenshot, confirming your action was recorded.",
    src: "./screenshot-notification.png",
  }
]) }}

And since I can SFTP to my Kindle at any time, I can easily view those screenshots on my computer. And since KOReader provides a file browser, I can go find my screenshots at `/mnt/us/koreader/screenshots/` and view them on my Kindle itself!

## Add a Dictionary

My KOReader installation did not have a dictionary installed by default; I'm unsure if I configured it that way or if this is expected. There are two methods for installing dictionaries: through KOReader's top menu and by manually transferring dictionaries.

{{ image_gallery([
    {
        alt: "KOReader's Search menu",
        caption: "In KOReader, tap the magnifying glass icon to access the Search menu.",
        src: "./menu-search.png",
    },
    {
        alt: "KOReader's Search Settings menu",
        caption: "From the Search menu, select the \"Settings\" option to configure dictionary and search preferences.",
        src: "./menu-search-settings.png",
    },
    {
        alt: "KOReader's Dictionary Settings menu",
        caption: "The \"Dictionary Settings\" menu allows you to manage, download, and configure how dictionaries work in KOReader.",
        src: "./menu-search-settings-dictionary.png",
    },
]) }}

### Through KOReader's Top Menu

The first option is to install a dictionary from inside KOReader. Navigate to the Search menu (represented by a magnifying glass), then select Settings, and finally, Download Dictionaries. The annoying part about this method is that there are 20 pages worth of dictionaries that you need to flip through. "E" for "English" is early on in the alphabet, so it's on page 4 for me.

{{ image_gallery([
  {
    alt: "KOReader's Download Dictionaries menu",
    caption: "The \"Download Dictionaries\" submenu shows a paginated list of available dictionaries to install.",
    src: "./menu-search-settings-dictionary-download.png",
  },
  {
    alt: "English dictionary selection in KOReader",
    caption: "The English dictionary can be found on page 4 of the \"Download Dictionaries\" submenu.",
    src: "./menu-search-settings-dictionary-download-english.png",
  }
]) }}

### Manually via SFTP (or wired)

My preferred approach is to download dictionary bundles manually and copy them to my Kindle via SFTP (or wired, if you prefer). The dictionaries I downloaded and installed are based on daily dumps from [Wiktionary](https://www.wiktionary.org/); I got the English-only dictionary and an English-Spanish dictionary.

- [English Dictionary from Wiktionary](https://www.reader-dict.com/en/download/en) (i.e. `dict-en-en.zip`)
- [Bilingual Dictionaries from Wiktionary](https://download.wikdict.com/dictionaries/stardict/) (i.e. `wikdict-en-es.zip`)

KOReader supports dictionaries that are in the [StarDict](https://en.wikipedia.org/wiki/StarDict) format, which consists of extensions such as `*.idx`, `*.ifo`, or `*.ifo.gz`, as well as `*.dict` or `*.dict.dz`. The above links will download a ZIP file, respectively, that, when extracted, gives you folders with their StarDict files inside. Extracting these ZIP files gave me the `dict-en-en` and `wikdict-en-es` folders.

KOReader requires dictionaries to be stored in `/mnt/us/koreader/data/dict` (or `/koreader/data/dict` when connected with a cable). Each dictionary requires two levels of folders, so I created two folders to store my downloaded dictionary: "WikDict Bilingual" and "Ebook Reader Dict;" I then put `wikdict-en-es` and `dict-en-en` in those folders, respectively.

```
.
  |- GNU Collaborative International Dictionary of English
  |  |- gcide
  |  |  |- stardict.idx
  |  |  |- stardict.dict.dz
  |  |  |- stardict.syn
  |  |  |- stardict.ifo
  |  |  |- stardict.idx.oft
  |- WikDict Bilingual
  |  |- wikdict-en-es
  |  |  |- stardict.dict.dz
  |  |  |- stardict.idx
  |  |  |- stardict.ifo
  |  |  |- stardict.idx.oft
  |- Ebook Reader Dict
  |  |- dict-en-en
  |  |  |- dict-data.ifo
  |  |  |- dict-data.dict.dz
  |  |  |- dict-data.syn.dz
  |  |  |- res/
  |  |  |- dict-data.idx
  |  |  |- dict-data.idx.oft
```

After installing dictionaries, the `data/dict/` folder looks like the file tree shown above. The "GNU Collaborative International Dictionary of English" folder was automatically created for me by KOReader when I installed the English dictionary through the KOReader UI (as discussed in the previous section).

{{ image_gallery([
  {
    alt: "KOReader's Dictionary Management interface",
    caption: "The \"Dictionary Management\" menu allows you to view and manage all installed dictionaries on your Kindle.",
    src: "./menu-search-settings-dictionary-manage.png",
  }
]) }}

## Exiting KOReader

One important thing to note is that while KOReader is running, it is not possible to connect your Kindle to your computer using a USB cable and transfer data to it. For me, this isn't an issue since I've set up SSH, and I've been wanting the ability to manage my Kindle wirelessly from my desk.

Now, I may not need to exit KOReader to transfer any books to it, but it is helpful to know how to exit an application; I'm looking at you, Vim. Exiting KOReader will return me to my stock Kindle UI; this will turn off any of the features I mentioned, such as screenshots or SSH. The way I see it is KOReader is your enhanced "operating system" providing many useful services and integrations/apps. I intend on running KOReader 24/7 on my Kindle and treat it as a better OS.

{{ image_gallery([
  {
    alt: "KOReader's main menu",
    caption: "Access the main menu by tapping the hamburger icon to find the Exit submenu.",
    src: "./menu-main.png",
  },
  {
    alt: "KOReader's exit confirmation dialog",
    caption: "Select \"Exit\" once more to close KOReader and return to the stock Kindle interface.",
    src: "./menu-main-exit.png",
  }
]) }}

Click on the Main menu (the hamburger icon), then click on Exit, and choose Exit again to shut down KOReader entirely.

## Next free weekend's task: integrating calibre

One of the most powerful features that I'm excited about is its **wireless** integration with calibre! My tags, genres, and collections—everything I've worked on—will finally integrate smoothly with my Kindle. Something Amazon would never support with its shit excuse for a library UI on its website or within its apps. However, I have yet to fully learn about this feature, and it will be a project for another weekend.
