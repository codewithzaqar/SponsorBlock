if(id = youtube_parser(document.URL)){ // Direct Links
    SponsorsLookup(id)
}


chrome.runtime.onMessage.addListener( // Detect URL Changes
    function(request, sender, sendResponse) {
        if (request.message === 'ytvideoid') { // Message from background script
            SponsorsLookup(request.id);
        }

        // Message from popup script
        if (request.message === 'sponsorStart') {
            sponsorMessageStarted()
        }
    })

function SponsorsLookup(id) {
    v = document.querySelector('video') // Youtube video player
    var xmlhttp = new XMLHttpRequest()
    xmlhttp.open('GET', 'https://officialnoob.github.io/YTSponsorSkip-Dataser/'+ id, true) // Dataset lookup 
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            Sponsors = JSON.parse(xmlhttp.responseText)
            v.ontimeupdate = function() { // If exists add event to run on the videos "ontimeupdate"
                SponsorCheck(Sponsors)
            }
        }
    }
    xmlhttp.send(null)
}

function SponsorCheck(Sponsors) { // Video skipping
    Sponsors.forEach(function(el, index) { // Foreach Sponnsor in video
        if ((Math.floor(v.currentTime)) == el[0]) {
            v.currentTime = el[1] // Set new time
        }
    })
}

function youtube_parser(url) { // Returns with video id else returns false
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length == 11) ? match[7] : false;
}

function sponsorMessageStarted() {
    let v = document.querySelector('video')

    console.log(v.currentTime)

    // send back current time
    chrome.runtime.sendMessage({
        message: "time",
        time: v.currentTime
    })
}