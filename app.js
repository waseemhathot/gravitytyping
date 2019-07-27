var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
function loadGame() {
    return __awaiter(this, void 0, void 0, function () {
        var textsUrl, ranksUrl, playerRankUrl, spaceKeyCode, backspaceKeyCode, loadingElement, elementsHolder, textHolder, gameHolder, imageHolder, textRes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    textsUrl = 'https://gravity-typing.herokuapp.com/api/text';
                    ranksUrl = 'https://gravity-typing.herokuapp.com/api/players';
                    playerRankUrl = 'https://gravity-typing.herokuapp.com/api/player';
                    spaceKeyCode = 32;
                    backspaceKeyCode = 8;
                    loadingElement = document.querySelector('.game__loading-animation');
                    elementsHolder = {
                        textDiv: document.querySelector('.main-content__game-text p'),
                        inputText: document.querySelector('.user-input__text'),
                        resetButton: document.querySelector('.reset-button'),
                        submitScoreButton: document.querySelector('.submit-score-button'),
                        cvs: document.querySelector('#canvas'),
                        difficultySelect: document.querySelector('.game-control__select'),
                        ranksTableElement: document.querySelector('.player-ranks__table tbody'),
                        playerNameInput: document.querySelector('.player-name-input__input')
                    };
                    textHolder = {
                        wordCtr: 0,
                        input: [],
                        textArray: []
                    };
                    gameHolder = {
                        rY: 450,
                        rX: 20,
                        wpm: 0,
                        gravity: 0,
                        gameOver: false,
                        gameWon: false,
                        gameStart: false,
                        gameStartTime: 0,
                        gameEndTime: 0
                    };
                    imageHolder = {
                        whiteImage: new Image(),
                        spikeImage: new Image(),
                        cvsImage1: new Image(),
                        gameOverImage: new Image(),
                        winImage: new Image()
                    };
                    disableButton(elementsHolder.submitScoreButton);
                    displayLoadingAnimation(elementsHolder.cvs, elementsHolder.textDiv, elementsHolder.inputText);
                    return [4 /*yield*/, getText(textsUrl)["catch"](function () {
                            var defaultString = "Computer programming is the process of designing and building an executable computer program for accomplishing a specific computing task. Programming involves tasks such as: analysis, generating algorithms, profiling algorithms' accuracy and resource consumption, and the implementation of algorithms in a chosen programming language (commonly referred to as coding).";
                            return defaultString;
                        })];
                case 1:
                    textRes = _a.sent();
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
                    return [2 /*return*/];
            }
        });
    });
}
window.onload = function () {
    loadGame();
};
function loadRanks(elementsHolder, ranksUrl) {
    return __awaiter(this, void 0, void 0, function () {
        var playersRankRes, i, playerRow, playerRank, playerName, playerWpm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getPlayersRank(ranksUrl)];
                case 1:
                    playersRankRes = _a.sent();
                    for (i = 0; i < playersRankRes.length && i < 10; i++) {
                        playerRow = document.createElement('tr');
                        playerRank = document.createElement('td');
                        playerName = document.createElement('td');
                        playerWpm = document.createElement('td');
                        playerRank.textContent = '' + (i + 1);
                        playerName.textContent = playersRankRes[i].name;
                        playerWpm.textContent = playersRankRes[i].wpm;
                        elementsHolder.ranksTableElement.appendChild(playerRow);
                        playerRow.appendChild(playerRank);
                        playerRow.appendChild(playerName);
                        playerRow.appendChild(playerWpm);
                    }
                    return [2 /*return*/];
            }
        });
    });
}
function initImages(imageHolder) {
    imageHolder.cvsImage1.src = "images/balloon-icon.png";
    imageHolder.spikeImage.src = "images/paint-spikes.png";
    imageHolder.whiteImage.src = "images/White_image.jpg";
    imageHolder.gameOverImage.src = "images/game_over.png";
    imageHolder.winImage.src = "images/win_image_3.png";
}
function initInputListener(elementsHolder, textHolder, gameHolder, spaceKeyCode, backspaceKeyCode) {
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
                    var currTime = (new Date().getTime() / 1000) / 60;
                    var timePassed = currTime - gameHolder.gameStartTime;
                    if (timePassed > 0) {
                        var wpm = Math.round((textHolder.wordCtr / timePassed) * 100) / 100;
                        gameHolder.wpm = wpm;
                    }
                    updateText(elementsHolder, textHolder);
                    if (gameHolder.rX > 0) {
                        gameHolder.rX -= 30;
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
function initResetListner(elementsHolder, textHolder, imageHolder, gameHolder) {
    elementsHolder.resetButton.addEventListener("click", function () {
        reset(elementsHolder, textHolder, imageHolder, gameHolder);
    });
}
function initSubmitListener(elementsHolder, gameHolder, playerRankUrl, ranksUrl) {
    var _this = this;
    elementsHolder.submitScoreButton.addEventListener('click', function () { return __awaiter(_this, void 0, void 0, function () {
        var playerName, tableRows, i;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    playerName = elementsHolder.playerNameInput.value;
                    if (!(playerName.length > 0 && playerName.length <= 16 && gameHolder.gameWon === true)) return [3 /*break*/, 2];
                    return [4 /*yield*/, fetch(playerRankUrl + "/" + playerName + "/" + gameHolder.wpm, { method: 'POST' })];
                case 1:
                    _a.sent();
                    tableRows = document.querySelectorAll('tr');
                    console.log(tableRows);
                    for (i = 1; i < tableRows.length; i++) {
                        tableRows[i].remove();
                    }
                    loadRanks(elementsHolder, ranksUrl);
                    disableButton(elementsHolder.submitScoreButton);
                    elementsHolder.resetButton.click();
                    return [3 /*break*/, 3];
                case 2:
                    if (playerName.length === 0 || playerName.length > 16) {
                        window.alert('Name must be 16 chars or less');
                    }
                    _a.label = 3;
                case 3: return [2 /*return*/];
            }
        });
    }); });
}
function reset(elementsH, textH, imageH, gameH) {
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
    disableButton(elementsH.resetButton);
    drawCanvas(elementsH, textH, imageH, gameH);
}
function drawCanvas(elementsHolder, textHolder, imageHolder, gameHolder) {
    var ctx = elementsHolder.cvs.getContext('2d');
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
    if (gameHolder.rX >= 240 && gameHolder.gameOver === false) {
        gameHolder.gameOver = true;
        ctx.drawImage(imageHolder.gameOverImage, 350, 0);
        enableButton(elementsHolder.resetButton);
    }
    gameHolder.rX += gameHolder.gravity;
    if (gameHolder.gameOver === false && gameHolder.gameWon === false) {
        requestAnimationFrame(function () {
            drawCanvas(elementsHolder, textHolder, imageHolder, gameHolder);
        });
    }
}
function validateElements(elementsH) {
    if (!elementsH.textDiv || !elementsH.inputText) {
        throw new Error('one or two of the elements doesnt exist');
    }
}
function disableButton(button) {
    button.disabled = true;
    button.classList.remove("button--black-border");
    button.classList.add("button--grey-border");
}
function enableButton(button) {
    button.disabled = false;
    button.classList.remove("button--grey-border");
    button.classList.add("button--black-border");
}
function updateText(elementsH, textH) {
    var htmlContent = '<p>';
    elementsH.textDiv.innerHTML = '';
    for (var i = 0; i < textH.textArray.length; i++) {
        if (i === textH.wordCtr) {
            htmlContent += "<span class='curr-word'>" + textH.textArray[i] + "</span> ";
        }
        else if (i === (textH.textArray.length - 1)) {
            htmlContent += textH.textArray[i];
        }
        else {
            htmlContent += textH.textArray[i] + ' ';
        }
    }
    htmlContent += '</p>';
    elementsH.textDiv.innerHTML = htmlContent;
}
function getText(url) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
function getPlayersRank(url) {
    return __awaiter(this, void 0, void 0, function () {
        var res, data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fetch(url)];
                case 1:
                    res = _a.sent();
                    return [4 /*yield*/, res.json()];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
            }
        });
    });
}
function getDifficulty(elementsHolder) {
    var elementValue = elementsHolder.difficultySelect.value;
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
function displayLoadingAnimation(cvsElement, gameTextElement, inputTextElement) {
    cvsElement.style.display = 'none';
    gameTextElement.style.display = 'none';
    inputTextElement.style.display = 'none';
}
function removeLoadingAnimation(cvsElement, gameTextElement, inputTextElement, loadingDiv) {
    document.querySelector('.game__loading-animation').remove();
    cvsElement.style.display = 'block';
    gameTextElement.style.display = 'block';
    inputTextElement.style.display = 'block';
}
