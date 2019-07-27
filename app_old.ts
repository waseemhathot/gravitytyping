






function loadGame(){
    const url: string  = 'http://localhost:8080/api/text';
    const spaceKeyCode = 32;
    getText(url).then((data) => {

        const elementsHolder: DomElementsHolder = {
            textDiv: document.querySelector('.main-content__game-text p'),
            inputText: document.querySelector('.user-input__text'),
            resetButton: document.querySelector('.reset-button')
        }

        const textHolder: TextHolder = {
            wordCtr: 0,
            input: [],
            textArray: elementsHolder.textDiv.textContent.split(' ')
        }

        validateElements(elementsHolder);
        updateText(elementsHolder, textHolder);

        elementsHolder.inputText.addEventListener("keyup", function (event) {
            if (gameHolder.gameOver === false) {
                gameHolder.gravity = 0.20;
                if (event.keyCode === spaceKeyCode) {
                    textHolder.input = this.value.split(' ');
                    
                    if((textHolder.textArray.length - 1) === textHolder.wordCtr){
                        gameHolder.gameWon = true;
                    }
        
                    if (textHolder.textArray[textHolder.wordCtr] === textHolder.input[0] && textHolder.wordCtr < textHolder.textArray.length) {
                        textHolder.wordCtr++;
                        updateText(elementsHolder, textHolder);
                        if (gameHolder.rX > 0) {
                            gameHolder.rX -= 30;
                        }
                        this.value = textHolder.input[1];
                        elementsHolder.inputText.classList.remove('user-input__text--color-red');
                    }
        
                    else{
                        elementsHolder.inputText.classList.add('user-input__text--color-red');
                    }
                }
            }

        });

        const cvs: HTMLCanvasElement = document.querySelector('#canvas');
        let ctx: CanvasRenderingContext2D = cvs.getContext('2d');
        cvs.width = 999;
        cvs.height = 400;

        const cvsImage1 = new Image();
        const whiteImage = new Image();
        const spikeImage = new Image();
        const gameOverImage = new Image();
        const winImage = new Image();

     

        canvasDraw();
    });
}

const gameHolder: GameHolder = {
    rY: 450,
    rX: 30,
    gravity: 0,
    gameOver: false,
    gameWon: false
}



function updateText(elementsH: DomElementsHolder, textH: TextHolder) {
    let htmlContent = '<p>';
    elementsH.textDiv.innerHTML = '';
    for (let i = 0; i < textH.textArray.length; i++) {
        if (i === textH.wordCtr) {
            htmlContent += `<span class='curr-word'>${textH.textArray[i]}</span> `
        }
        else if(i === (textH.textArray.length - 1)){
            htmlContent += textH.textArray[i];
        }
        else{
            htmlContent += textH.textArray[i] + ' ';
        }
    }
    htmlContent += '</p>'
    elementsH.textDiv.innerHTML = htmlContent;
}


function canvasDraw() {
    ctx.drawImage(whiteImage, 0, 0);
    ctx.drawImage(spikeImage, 0, cvs.height - spikeImage.height + 2);
    ctx.drawImage(cvsImage1, gameHolder.rY, gameHolder.rX, 100, 100);

    if (gameHolder.rY > 960) {
        gameHolder.rY = 0;
    }
    // console.log('over: ' + gameHolder.gameOver);
    // console.log('won: ' + gameHolder.gameWon);
    // console.log('rx: ' + gameHolder.rX);
    if(gameHolder.gameWon === true){
        gameHolder.gravity = 0;
        ctx.drawImage(winImage, 250, 0);
        enableButton(elementsHolder.resetButton);
    }

    if (gameHolder.rX >= 235 && gameHolder.gameOver === false) {
        gameHolder.gameOver = true;
        ctx.drawImage(gameOverImage, 350, 0);
        enableButton(elementsHolder.resetButton);
    }

    gameHolder.rX += gameHolder.gravity;
    if (gameHolder.gameOver === false && gameHolder.gameWon === false) {
        requestAnimationFrame(canvasDraw);
    }
}


function resetGame(){
    reset(textHolder, gameHolder, elementsHolder);
}

function reset(textH: TextHolder, gameH: GameHolder, elementsH: DomElementsHolder){
    elementsH.inputText.classList.remove('user-input__text--color-red');
    elementsH.inputText.value = '';
    textH.textArray = elementsH.textDiv.textContent.split(' ');
    textH.wordCtr = 0;
    gameH.gameOver = false;
    gameH.gameWon = false;
    gameH.gravity = 0;
    gameH.rX = 30;
    gameH.rY = 450;
    updateText(elementsH, textH);
    disableButton(elementsH.resetButton);
    canvasDraw();
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


async function getText(url: string): Promise<string>{
    const res = await fetch(url);
    const data = await res.json();
    return data;
}


loadGame();


function initDraw(ImageH: ImageHolder, elementsH: DomElementsHolder, textH: TextHolder, cvs: HTMLCanvasElement){

}