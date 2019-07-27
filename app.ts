interface Player {
    id: string;
    name: string;
    wpm: string;
}

type DomElementsHolder = {
    textDiv: HTMLElement,
    inputText: HTMLInputElement,
    resetButton: HTMLButtonElement,
    submitScoreButton: HTMLButtonElement,
    cvs: HTMLCanvasElement,
    difficultySelect: HTMLSelectElement,
    ranksTableElement: HTMLTableElement,
    playerNameInput: HTMLInputElement
}

type TextHolder = {
    wordCtr: number,
    input: string[],
    textArray: string[]
}

type GameHolder = {
    rY: number,
    rX: number,
    gravity: number,
    wpm: number,
    gameOver: boolean,
    gameWon: boolean,
    gameStart: boolean,
    gameStartTime: number,
    gameEndTime: number
}

type ImageHolder = {
    cvsImage1: HTMLImageElement,
    whiteImage: HTMLImageElement,
    spikeImage: HTMLImageElement,
    gameOverImage: HTMLImageElement,
    winImage: HTMLImageElement
}

async function loadGame() {
    const textsUrl: string = 'https://gravity-typing.herokuapp.com/api/text';
    const ranksUrl: string = 'https://gravity-typing.herokuapp.com/api/players';
    const playerRankUrl: string = 'https://gravity-typing.herokuapp.com/api/player';

    const spaceKeyCode = 32;
    const backspaceKeyCode = 8;
    const loadingElement: HTMLElement = document.querySelector('.game__loading-animation');

    const elementsHolder: DomElementsHolder = {
        textDiv: document.querySelector('.main-content__game-text p'),
        inputText: document.querySelector('.user-input__text'),
        resetButton: document.querySelector('.reset-button'),
        submitScoreButton: document.querySelector('.submit-score-button'),
        cvs: document.querySelector('#canvas'),
        difficultySelect: document.querySelector('.game-control__select'),
        ranksTableElement: document.querySelector('.player-ranks__table tbody'),
        playerNameInput: document.querySelector('.player-name-input__input')
    }

    const textHolder: TextHolder = {
        wordCtr: 0,
        input: [],
        textArray: []
    }

    const gameHolder: GameHolder = {
        rY: 450,
        rX: 20,
        wpm: 0,
        gravity: 0,
        gameOver: false,
        gameWon: false,
        gameStart: false,
        gameStartTime: 0,
        gameEndTime: 0
    }

    const imageHolder: ImageHolder = {
        whiteImage: new Image(),
        spikeImage: new Image(),
        cvsImage1: new Image(),
        gameOverImage: new Image(),
        winImage: new Image()
    }

    disableButton(elementsHolder.submitScoreButton);
    displayLoadingAnimation(elementsHolder.cvs, elementsHolder.textDiv, elementsHolder.inputText);

    const textRes = await getText(textsUrl).catch(() => {
        const defaultString: string = `Computer programming is the process of designing and building an executable computer program for accomplishing a specific computing task. Programming involves tasks such as: analysis, generating algorithms, profiling algorithms' accuracy and resource consumption, and the implementation of algorithms in a chosen programming language (commonly referred to as coding).`;
        return defaultString;
    });

    loadRanks(elementsHolder, ranksUrl);
    removeLoadingAnimation(elementsHolder.cvs, elementsHolder.textDiv, elementsHolder.inputText, loadingElement);

    disableButton(elementsHolder.resetButton);

    initImages(imageHolder);
    initInputListener(elementsHolder, textHolder, gameHolder, spaceKeyCode, backspaceKeyCode);
    initResetListner(elementsHolder, textHolder, imageHolder, gameHolder);
    initSubmitListener(elementsHolder, gameHolder, playerRankUrl, ranksUrl);

    elementsHolder.textDiv.textContent = textRes;
    textHolder.textArray = elementsHolder.textDiv.textContent.split(' ');
    updateText(elementsHolder, textHolder);

    elementsHolder.cvs.width = 999;
    elementsHolder.cvs.height = 400;

    drawCanvas(elementsHolder, textHolder, imageHolder, gameHolder);
}

window.onload = () => {
    loadGame();
}


async function loadRanks(elementsHolder: DomElementsHolder, ranksUrl: string) {
    const playersRankRes: Player[] = await getPlayersRank(ranksUrl);

    for (let i = 1; i < playersRankRes.length && i < 11; i++) {
        const playerRow: HTMLElement = document.createElement('tr');
        const playerRank: HTMLElement = document.createElement('td');
        const playerName: HTMLElement = document.createElement('td');
        const playerWpm: HTMLElement = document.createElement('td');

        playerRank.textContent = '' + i;
        playerName.textContent = playersRankRes[i].name;
        playerWpm.textContent = playersRankRes[i].wpm;

        elementsHolder.ranksTableElement.appendChild(playerRow);
        playerRow.appendChild(playerRank);
        playerRow.appendChild(playerName);
        playerRow.appendChild(playerWpm);
    }
}


function initImages(imageHolder: ImageHolder) {
    imageHolder.cvsImage1.src = "images/balloon-icon.png";
    imageHolder.spikeImage.src = "images/spikes-long.png";
    imageHolder.whiteImage.src = "images/White_image.jpg";
    imageHolder.gameOverImage.src = "images/game_over.png";
    imageHolder.winImage.src = "images/win_image_3.png";
}

function initInputListener(elementsHolder: DomElementsHolder, textHolder: TextHolder, gameHolder: GameHolder, spaceKeyCode: number, backspaceKeyCode: number) {
    elementsHolder.inputText.addEventListener("keyup", function (event) {
        if (gameHolder.gameOver === false) {
            gameHolder.gravity = getDifficulty(elementsHolder);

            if (event.keyCode === backspaceKeyCode) {
                elementsHolder.inputText.classList.remove('user-input__text--color-red');
            }

            if (event.keyCode === spaceKeyCode) {
                textHolder.input = this.value.split(' ');

                if (gameHolder.gameStart === false) {
                    gameHolder.gameStart = true;
                    gameHolder.gameStartTime = (new Date().getTime() / 1000) / 60;
                }

                if (textHolder.textArray[textHolder.wordCtr] === textHolder.input[0] && textHolder.wordCtr < textHolder.textArray.length) {
                    textHolder.wordCtr++;
                    const currTime: number = (new Date().getTime() / 1000) / 60;
                    const timePassed: number = currTime - gameHolder.gameStartTime;

                    if (timePassed > 0) {
                        const wpm: number = Math.round((textHolder.wordCtr / timePassed) * 100) / 100;
                        gameHolder.wpm = wpm;
                    }

                    updateText(elementsHolder, textHolder);

                    if (gameHolder.rX > 0) {
                        gameHolder.rX -= 25;
                    }

                    this.value = textHolder.input[1];
                    elementsHolder.inputText.classList.remove('user-input__text--color-red');

                    if ((textHolder.textArray.length) === textHolder.wordCtr) {
                        gameHolder.gameWon = true;
                        enableButton(elementsHolder.submitScoreButton);
                    }
                }
                else {
                    elementsHolder.inputText.classList.add('user-input__text--color-red');
                }
            }
        }
    });
}


function initResetListner(elementsHolder: DomElementsHolder, textHolder: TextHolder, imageHolder: ImageHolder, gameHolder: GameHolder) {
    elementsHolder.resetButton.addEventListener("click", () => {
        reset(elementsHolder, textHolder, imageHolder, gameHolder);
    });
}

function initSubmitListener(elementsHolder: DomElementsHolder, gameHolder: GameHolder, playerRankUrl: string, ranksUrl: string) {
    elementsHolder.submitScoreButton.addEventListener('click', async () => {
        const playerName = elementsHolder.playerNameInput.value;

        if (playerName.length > 0 && playerName.length <= 16 && gameHolder.gameWon === true) {
            await fetch(`${playerRankUrl}/${playerName}/${gameHolder.wpm}`, { method: 'POST' });
            let tableRows = document.querySelectorAll('tr');
            console.log(tableRows);
            for (let i = 1; i < tableRows.length; i++) {
                tableRows[i].remove();
            }
            loadRanks(elementsHolder, ranksUrl);
            disableButton(elementsHolder.submitScoreButton);
            elementsHolder.resetButton.click();
        }
        else {
            if (playerName.length === 0 || playerName.length > 16) {
                window.alert('Name must be 16 chars or less');
            }
        }
    });
}

function reset(elementsH: DomElementsHolder, textH: TextHolder, imageH: ImageHolder, gameH: GameHolder) {
    elementsH.inputText.classList.remove('user-input__text--color-red');
    elementsH.inputText.value = '';
    textH.textArray = elementsH.textDiv.textContent.split(' ');
    textH.wordCtr = 0;
    gameH.gameOver = false;
    gameH.gameWon = false;
    gameH.gameStart = false;
    gameH.gameStartTime = 0;
    gameH.gravity = 0;
    gameH.wpm = 0;
    gameH.rX = 20;
    gameH.rY = 450;
    updateText(elementsH, textH);
    disableButton(elementsH.submitScoreButton);
    disableButton(elementsH.resetButton);
    drawCanvas(elementsH, textH, imageH, gameH);
}

function drawCanvas(elementsHolder: DomElementsHolder, textHolder: TextHolder, imageHolder: ImageHolder, gameHolder: GameHolder) {
    let ctx: CanvasRenderingContext2D = elementsHolder.cvs.getContext('2d');
    ctx.drawImage(imageHolder.whiteImage, 0, 0);
    ctx.drawImage(imageHolder.spikeImage, 0, elementsHolder.cvs.height - imageHolder.spikeImage.height + 2);
    ctx.drawImage(imageHolder.cvsImage1, gameHolder.rY, gameHolder.rX, 100, 100);
    ctx.font = "30px Arial";
    ctx.fillText('WPM: ' + gameHolder.wpm, 10, 50);

    if (gameHolder.rY > 960) {
        gameHolder.rY = 0;
    }

    if (gameHolder.gameWon === true) {
        gameHolder.gravity = 0;
        ctx.drawImage(imageHolder.winImage, 250, 0);
        enableButton(elementsHolder.resetButton);
    }

    if (gameHolder.rX >= 270 && gameHolder.gameOver === false) {
        gameHolder.gameOver = true;
        ctx.drawImage(imageHolder.gameOverImage, 350, 0);
        enableButton(elementsHolder.resetButton);
    }

    gameHolder.rX += gameHolder.gravity;
    if (gameHolder.gameOver === false && gameHolder.gameWon === false) {
        requestAnimationFrame(() => {
            drawCanvas(elementsHolder, textHolder, imageHolder, gameHolder);
        });
    }
}

function validateElements(elementsH: DomElementsHolder) {
    if (!elementsH.textDiv || !elementsH.inputText) {
        throw new Error('one or two of the elements doesnt exist');
    }
}

function disableButton(button: HTMLButtonElement) {
    button.disabled = true;
    button.classList.remove("button--black-border");
    button.classList.add("button--grey-border");
}

function enableButton(button: HTMLButtonElement) {
    button.disabled = false;
    button.classList.remove("button--grey-border");
    button.classList.add("button--black-border");
}

function updateText(elementsH: DomElementsHolder, textH: TextHolder) {
    let htmlContent = '<p>';
    elementsH.textDiv.innerHTML = '';
    for (let i = 0; i < textH.textArray.length; i++) {
        if (i === textH.wordCtr) {
            htmlContent += `<span class='curr-word'>${textH.textArray[i]}</span> `
        }
        else if (i === (textH.textArray.length - 1)) {
            htmlContent += textH.textArray[i];
        }
        else {
            htmlContent += textH.textArray[i] + ' ';
        }
    }
    htmlContent += '</p>'
    elementsH.textDiv.innerHTML = htmlContent;
}

async function getText(url: string): Promise<string> {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

async function getPlayersRank(url: string): Promise<Player[]> {
    const res = await fetch(url);
    const data = await res.json();
    return data;
}

function getDifficulty(elementsHolder: DomElementsHolder): number {
    const elementValue = elementsHolder.difficultySelect.value;
    if (elementValue === 'Easy') {
        return 0.2;
    }
    else if (elementValue === 'Normal') {
        return 0.34;
    }
    else if (elementValue === 'Hard') {
        return 0.48;
    }
    else {
        return 0.68;
    }
}



function displayLoadingAnimation(cvsElement: HTMLCanvasElement, gameTextElement: HTMLElement, inputTextElement: HTMLInputElement) {
    cvsElement.style.display = 'none';
    gameTextElement.style.display = 'none';
    inputTextElement.style.display = 'none';


}

function removeLoadingAnimation(cvsElement: HTMLCanvasElement, gameTextElement: HTMLElement, inputTextElement: HTMLInputElement, loadingDiv: HTMLElement) {
    document.querySelector('.game__loading-animation').remove();
    cvsElement.style.display = 'block';
    gameTextElement.style.display = 'block';
    inputTextElement.style.display = 'block';

}