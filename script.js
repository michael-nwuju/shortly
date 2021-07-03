const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const overlay = document.querySelector('.overlay');
const html = document.querySelector('html');
const siteLinks = document.querySelectorAll('.mls');
const body = document.querySelector('body');
const heroImage = document.querySelector('.hero-image');
const err = document.querySelector('.err');
const scroller = document.querySelector('.scroller button');
const input = document.querySelector('.input-wrap input');
const shortener = document.querySelector('.input-wrap button');
const results = document.querySelector('.results');
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('toggled');
    mobileMenu.classList.toggle('fading');
    mobileMenu.classList.toggle('open');
    overlay.classList.toggle('enabled');
    html.classList.toggle('overflower');
    heroImage.classList.toggle('hide');
    siteLinks.forEach((siteLink) => {
        if (true) {
            siteLink.addEventListener('click', () => {
                html.classList.remove('overflower');
                hamburger.classList.remove('toggled');
                overlay.classList.remove('enabled');
                mobileMenu.classList.remove('fading');
                mobileMenu.classList.remove('open');
                heroImage.classList.remove('hide');
            })
        }
    })
})

window.onscroll = () => {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        scroller.classList.add('fading');
        scroller.style.display = "block";
    }
    else {
        scroller.classList.remove('fading');
        scroller.style.display = "none";
    }
}
scroller.addEventListener('click', () => {
    document.documentElement.scrollTop = '0';
})

async function shortenUrl() {
    if (input.value === '' || input.value === null) {
        err.classList.add('error');
        input.classList.add('error');
        setTimeout(() => {
            input.classList.remove('error');
            err.classList.remove('error');
        }, 2500)
        return;
    }
    else {
        try {
            shortener.innerHTML = `<img src="images/loading.gif">`
            const apiUrl = `https://api.shrtco.de/v2/shorten?url=${input.value}`;
            const response = await fetch(apiUrl);
            const data = await response.json();
            if (data.ok !== true) {
                shortener.innerHTML = 'Shorten It!'
                err.classList.add('error');
                err.innerHTML = 'Invalid Link!'
                setTimeout(() => {
                    err.classList.remove('error');
                }, 3000)
                return;
            }
            shortener.innerHTML = 'Shorten It!'
            shortURL(data.result.original_link, data.result.full_short_link);
            input.value = '';
        } catch (error) {
            shortener.innerHTML = 'Shorten It!'
            err.classList.add('error');
            input.classList.add('error');
            err.innerHTML = error;
            setTimeout(() => {
                input.classList.remove('error');
                err.classList.remove('error');
                input.value = '';
            }, 5000)
        }
    }
}

shortener.addEventListener('click', shortenUrl);
input.addEventListener('keyup', event => {
    if (event.keyCode == '13') {
        shortenUrl();
    }
})

function shortURL(longUrl, shortUrl) {
    results.style.padding = '2em';
    const url =
        `<div class="result">
    <div class="result-wrap">
    <div class="long-url">${longUrl}</div>
    <div class="short-url">${shortUrl}</div>
    </div>
    <button class="copy-to-clipboard">Copy</button>
    </div>`
    results.insertAdjacentHTML('beforeend', url);

    const longURLs = document.querySelectorAll('.long-url');
    longURLs.forEach((longURL) => {
        if (longURL.textContent.length > 25 && longURL.textContent.length < 50) {
            longURL.style.fontSize = '50%';
        }
        if (longURL.textContent.length > 50 && longURL.textContent.length < 75) {
            longURL.style.fontSize = '30%';
        }
        if (longURL.textContent.length > 75 && longURL.textContent.length < 100) {
            longURL.style.fontSize = '10%';
        }
        if (longURL.textContent.length >= 100) {
            console.log(longURL);
            longURL.style.fontSize = '5%';
        }
    })
    const copyButtons = document.querySelectorAll('.copy-to-clipboard');
    copyButtons.forEach((copyButton) => {
        copyButton.addEventListener('click', () => {
            shortUrl.select();
            shortUrl.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(shortUrl) || document.execCommand('copy');;
            copyButton.classList.add('copied');
            copyButton.innerHTML = 'Copied!';
            setTimeout(() => {
                copyButton.classList.remove("copied");
                copyButton.innerHTML = "Copy";
            }, 1000);
            setTimeout(() => {
                copyButton.parentNode.classList.add('fade-out');
            }, 3000)
            setTimeout(() => {
                copyButton.classList.remove('fade-out');
                const resultDivs = document.querySelectorAll('.result')
                copyButton.parentNode.parentNode.removeChild(copyButton.parentNode);
                if (resultDivs.length == 1) {
                    results.style.padding = '0em';
                }
                else {
                    results.style.padding = '2em';
                }
            }, 4000)
        })
    })
}
