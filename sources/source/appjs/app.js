// note: json imports only works with webpack!
import chromeShortcuts from "./google-chrome-macos-de.json"
import macbookKeyboard from "./macbook-keyboard-de.json"

export function initialize() { 
    //TODO
}

export function startFingerAcademy() {

  // config
  // const pathToShortcutsFile = 'json/google-chrome-macos-de.json';
  // const pathToKeyboardFile = 'json/macbook-keyboard-de.json';
  const localhostDev = 'localhost:3000';
  const errorHandlerEnabled = true;

  // user
  var currentShortcutNumber = 0;
  var highestShortcutNumber = 0;
  var userSelectedKeysArray;
  var userSuccessShortcutNumbers = new Set();

  // shortcuts
  var shortcutsData;
  var orderedShortcutsArray;
  var shuffledShortcutsArray;
  var currentShortcutObject;
  var currentShortcutKeysArray;
  var currentShortcutTitle;
  var currentShortcutScope;
  var finalShortcutNumber;

  // keyboard
  var keyboardData;
  var mobileKeysQuantity;
  var allKeyboardKeysArray;
  var currentMobileKeyboardRowsArray;

  // html areas
  var shortcutArea;
  var controlButtonsArea;
  var keyboardArea;
  var resultsArea;

  // buttons
  var buttonNext;
  var buttonPrevious;
  var buttonShowShortcut;

  // async function to set up the quiz
  async function quizSetup() {

    // try to fetch the json files and start the quiz
    try {

      // // define fetch timeout
      // const fetchTimeout = 5000;

      // // create multiple promises to fetch the files in parallel
      // const JSONPromises = [

      //   // fetch the json data files
      //   fetch(pathToShortcutsFile, {timeout: fetchTimeout}),
      //   fetch(pathToKeyboardFile, {timeout: fetchTimeout})
      // ];

      // // wait for all promises to resolve
      // const JSONResponses = await Promise.all(JSONPromises);

      // parse the json data
      //   const shortcutsJSONResponse = await JSONResponses[0].json();
      //   const keyboardJSONResponse = await JSONResponses[1].json();
      
      // we use the imported json instead
      const shortcutsJSONResponse = chromeShortcuts;
      const keyboardJSONResponse = macbookKeyboard;

      // escape html in the json data
      shortcutsData = searchAndReplaceAllStrings(shortcutsJSONResponse, escapeHTML);
      keyboardData = searchAndReplaceAllStrings(keyboardJSONResponse, escapeHTML);

      // unescape html in the json data
      if ('url' in shortcutsData) {
        shortcutsData.url = unescapeHTML(shortcutsData.url);
      }

      // start the quiz
      startQuiz();

    } // try

    // catch any errors that occur while fetching or parsing the json data
    catch (error) {

      // group the error messages in the console for better readability
      console.groupCollapsed('quizSetup() Error Details');
      console.error(error);
      console.groupEnd();

    } // catch

  }; // quizSetup()

  // function to start the shortcut quiz
  function startQuiz() {

    // set the shortcuts array and shuffle it
    orderedShortcutsArray = shortcutsData['shortcuts'];
    shuffledShortcutsArray = shuffleArray(orderedShortcutsArray);

    // set the final shortcut number
    finalShortcutNumber = shuffledShortcutsArray.length - 1;

    // create the shortcut area structure in the html document
    createShortcutArea();

    // update the shortcut area with the first shortcut question
    updateShortcutInfoArea();

    // create the control buttons area in the html document
    createControlButtonsArea();

    // create the keyboard area in the html document
    createKeyboardArea();

    // create the results area in the html document (hidden)
    createResultsArea();

  } // startQuiz()

  // function to create the shortcut area structure in the html document
  function createShortcutArea() {

    // select the existing shortcut area element
    shortcutArea = document.querySelector('.shortcutArea');

    // create the title area element
    let shortcutTitleArea = document.createElement('div');
    shortcutTitleArea.classList.add('shortcutTitleArea');
    shortcutArea.appendChild(shortcutTitleArea);

    // create the scope area element
    let shortcutScopeArea = document.createElement('div');
    shortcutScopeArea.classList.add('shortcutScopeArea');
    shortcutArea.appendChild(shortcutScopeArea);

    // create the keys area element
    let shortcutKeysArea = document.createElement('div');
    shortcutKeysArea.classList.add('shortcutKeysArea');
    shortcutArea.appendChild(shortcutKeysArea);

  } // createShortcutArea()

  // function to create the 'control buttons area' in the html document
  function createControlButtonsArea() {

    // select the existing 'control buttons' area element
    controlButtonsArea = document.querySelector('.controlButtonsArea');

    // 'previous' button
    // create the 'previous' button element
    buttonPrevious = document.createElement('button');
    buttonPrevious.classList.add('buttonPrevious');
    buttonPrevious.innerText = '<';

    // add an event listener to the 'previous' button
    buttonPrevious.addEventListener('click', () => {
      goToPreviousScreen();
    });

    // add the button to the 'control buttons' area
    controlButtonsArea.appendChild(buttonPrevious);

    // 'show shortcut' button
    // create the 'show shortcut' button element
    buttonShowShortcut = document.createElement('button');
    buttonShowShortcut.classList.add('buttonShowShortcut');
    buttonShowShortcut.innerText = 'O';

    // add an event listener to the 'show shortcut' button
    buttonShowShortcut.addEventListener('click', () => {
      showShortcut();
    });

    // add the button to the 'control buttons' area
    controlButtonsArea.appendChild(buttonShowShortcut);

    // 'next' button
    // create the 'next' button element
    buttonNext = document.createElement('button');
    buttonNext.classList.add('buttonNext');
    buttonNext.innerText = '>';

    // add an event listener to the 'next' button
    buttonNext.addEventListener('click', () => {
      goToNextScreen();
    });

    // add the button to the 'control buttons' area
    controlButtonsArea.appendChild(buttonNext);

  } // createControlButtonsArea()

  // function to create the current mobile keyboard area
  function createKeyboardArea() {

    // get the current shortcut
    currentShortcutKeysArray = shuffledShortcutsArray[currentShortcutNumber].shortcut;

    // set the amount of mobile keyboard keys
    mobileKeysQuantity = 20; // 5 x 4

    // clear the current mobile keys array and add the current shortcut keys
    let currentMobileKeysArray = currentShortcutKeysArray;

    // combine all keyboard keys into one array
    allKeyboardKeysArray = keyboardData.flat();

    // shuffle all keyboard keys
    let shuffledKeyboardKeysArray = shuffleArray(allKeyboardKeysArray);

    // remove the current shortcut keys from the shuffled keyboard keys array
    shuffledKeyboardKeysArray = shuffledKeyboardKeysArray.filter(key => !currentShortcutKeysArray.includes(key));

    // get the remaining mobile keys, for the current mobile keys array
    let remainingMobileKeys = shuffledKeyboardKeysArray.slice(currentMobileKeysArray.length, mobileKeysQuantity)

    // add the remaining mobile keys to the current mobile keys array
    currentMobileKeysArray = currentMobileKeysArray.concat(remainingMobileKeys);
    
    // shuffle the current mobile keys array
    currentMobileKeysArray = shuffleArray(currentMobileKeysArray);

    // empty the current mobile keyboard rows array
    currentMobileKeyboardRowsArray = [];

    // split the current mobile keys array into rows
    while (currentMobileKeysArray.length > 0) {
      currentMobileKeyboardRowsArray.push(currentMobileKeysArray.slice(0, 5));
      currentMobileKeysArray.splice(0, 5);
    }
    
    createKeyboardRowsAndKeys(currentMobileKeyboardRowsArray);

  } // createKeyboardArea()

  // function to create the desktop keyboard area
  function createDesktopKeyboardArea() {

    // get the keyboard rows array from the keyboard json data
    let keyboardRowsArray = keyboardData;

    // create the keyboard area rows and keys
    createKeyboardRowsAndKeys(keyboardRowsArray);

  } // createDesktopKeyboardArea()

  // function to fill the keyboard area with rows and keys
  function createKeyboardRowsAndKeys(rowsArray) {

    let keyboardRowsArray = rowsArray;
    let keyboardAreaRow;
    let keyboardAreaKey;
    let keyboardAreaRowNumber = 0;

    // select the keyboard area element
    keyboardArea = document.querySelector('.keyboardArea');

    // clear the keyboard area
    keyboardArea.innerHTML = '';

    // fill the keyboard area with rows and keys
    keyboardRowsArray.forEach(function (currentKeyboardAreaRow) {

      // create a new row element and add the class
      keyboardAreaRow = document.createElement('div');
      keyboardAreaRow.classList.add('keyboardRow');
      keyboardAreaRow.classList.add(`keyboardRow${keyboardAreaRowNumber}`);
      keyboardArea.appendChild(keyboardAreaRow);

      keyboardAreaRowNumber++;

      // create a new key button for each key in the current row
      currentKeyboardAreaRow.forEach(function (currentKeyboardAreaKey) {

        // create a new key button and add classes
        keyboardAreaKey = document.createElement('button');
        keyboardAreaKey.classList.add('key');
        keyboardAreaKey.innerHTML = currentKeyboardAreaKey;
        keyboardAreaKey.setAttribute('value', currentKeyboardAreaKey);
        keyboardAreaRow.appendChild(keyboardAreaKey);

        // add an event listener to the key button
        keyboardAreaKey.addEventListener('click', handleUserKeyInput);

      }); // currentKeyboardAreaRow.forEach()

    }); // keyboardRowsArray.forEach()
  
  } // createKeyboardRowsAndKeys()

  // function to create the results area
  function createResultsArea() {

    // select the existing results area element
    resultsArea = document.querySelector('.resultsArea');

    // hide the area on quiz start
    resultsArea.classList.add('hidden');

    // create the title area element
    let resultsTitle = document.createElement('h2');
    resultsTitle.innerHTML = 'Well done!'
    resultsTitle.classList.add('resultsTitle');
    resultsArea.appendChild(resultsTitle);
    
  } // createResultsArea()

  // function to manage the behavior of the 'next' button
  function goToNextScreen() {

    // case: the user is viewing the last question (and clicked 'next' button)
    if (finalShortcutNumber === currentShortcutNumber) {

      // increase the current shortcut number
      currentShortcutNumber++;

      // hide areas
      hideAreas('shortcutArea', 'keyboardArea');

      // show the results screen
      unhideAreas('resultsArea');

    }

    // case: the user is viewing the latest question (and clicked the 'next' button)
    else if (highestShortcutNumber === currentShortcutNumber) {
      
      // if this is the case, increase the current and the highest shortcut number
      currentShortcutNumber++;
      highestShortcutNumber++;

      // update the shortcut area with the next shortcut
      updateShortcutInfoArea();

      // clear and create the updated keyboard area in the html document
      createKeyboardArea();
    }

    // case: the user is viewing a previous question (and clicked the 'next' button)
    else if (currentShortcutNumber < highestShortcutNumber) {

      // if this is the case, increase the current shortcut number
      currentShortcutNumber++;

      // update the shortcut area with the next shortcut
      updateShortcutInfoArea();

      // clear and create the updated keyboard area in the html document
      createKeyboardArea();

    } // if else if

  } // goToNextScreen()

  // function to manage the behaviour of the 'previous' button
  function goToPreviousScreen() {

    // case: the user is viewing the second question (and clicked the 'previous' button)
    if (currentShortcutNumber === 1) {

      // if this is the case, decrease the current shortcut number
      currentShortcutNumber--;

      // update the shortcut area with the previous shortcut
      updateShortcutInfoArea();

      // clear and create the updated keyboard area in the html document
      createKeyboardArea();

    } // if

    // case: the user is on the results screen (and clicked the 'previous' button)
    else if (currentShortcutNumber > finalShortcutNumber) {

      // if this is the case, decrease the current shortcut number
      currentShortcutNumber--;

      // hide the results screen
      hideAreas('resultsArea');

      // show the hidden areas
      unhideAreas('shortcutArea', 'keyboardArea');

    } // else if

    // case: it's not first or second question or results screen (and clicked 'previous' button)
    else if (currentShortcutNumber > 1) {

      // if this is the case, decrease the current shortcut number
      currentShortcutNumber--;

      // update the shortcut area with the previous shortcut
      updateShortcutInfoArea();

      // clear and create the updated keyboard area in the html document
      createKeyboardArea();

    } // else if

    // case: the user is viewing the first question (and clicked the 'previous' button)
    // do nothing

  } // goToPreviousScreen()

  // fuction to handle the user input of a key
  function handleUserKeyInput(event) {

    // get the value of the clicked key
    let userSelectedKey = event.target.value;

    // check if the user has already selected this key
    if (userSelectedKeysArray.includes(userSelectedKey)) {

      // if this is the case, remove the key from the userSelectedKeysArray
      userSelectedKeysArray.splice(userSelectedKeysArray.indexOf(userSelectedKey), 1);

    } else {

      // add the key to the userSelectedKeysArray
      userSelectedKeysArray.push(userSelectedKey);

      // validate the user input
      validateUserInput();

    } // if else

    // update the shortcut keys area
    updateShortcutKeysArea();

  } // handleUserKeyInput()

  // function to check if the user input matches the current shortcut
  function validateUserInput() {

    // get the current shortcut
    currentShortcutKeysArray = shuffledShortcutsArray[currentShortcutNumber].shortcut;

    // compare the user input with the current shortcut
    let comparedArrays = compareArrays(userSelectedKeysArray, currentShortcutKeysArray)
    
    // select the shortcut keys area and remove the 'success' class
    let shortcutKeysArea = document.querySelector('.shortcutKeysArea');
    shortcutKeysArea.classList.remove('success');

    // check if the user input matches the current shortcut
    if (comparedArrays == 'success') {

      // add the shortcut number to the success set
      userSuccessShortcutNumbers.add(currentShortcutNumber);

      // add the 'success' class to the shortcut keys area
      shortcutKeysArea.classList.add('success');

      return 'success';
    }

  } // validateUserInput()

  // function to update the shortcut area with the current shortcut infos
  function updateShortcutInfoArea() {

    // clear the user input
    userSelectedKeysArray = [];

    // get the current shortcut array 
    currentShortcutObject = shuffledShortcutsArray[currentShortcutNumber];

    // set the current shortcut info variables
    currentShortcutTitle = currentShortcutObject.title;
    currentShortcutScope = currentShortcutObject.scope;

    // select the shortcut title and scope area
    let shortcutTitleArea = document.querySelector('.shortcutTitleArea');
    let shortcutScopeArea = document.querySelector('.shortcutScopeArea');
    let shortcutKeysArea = document.querySelector('.shortcutKeysArea');

    // clear the content
    shortcutTitleArea.innerHTML = '';
    shortcutScopeArea.innerHTML = '';
    shortcutKeysArea.innerHTML = '';
    
    // add the current shortcut title and scope to the shortcut area
    shortcutTitleArea.innerHTML = currentShortcutTitle;
    shortcutScopeArea.innerHTML = currentShortcutScope;

  } // updateShortcutInfoArea()

  // function to update the keys in the shortcut area
  function updateShortcutKeysArea() {

    // select the shortcut keys area
    let shortcutKeysArea = document.querySelector('.shortcutKeysArea');

    // clear the content
    shortcutKeysArea.innerHTML = '';

    // join the array to a string with a plus sign in between
    let joinedShortcuts = userSelectedKeysArray.join(' + ');

    // add the selected keys as text to the shortcut keys area
    shortcutKeysArea.innerHTML = joinedShortcuts;

  } // updateShortcutKeysArea()

  // function to show the current shortcut in the shortcut area
  function showShortcut() {

    // select the shortcut keys area element and clear it
    let shortcutKeysArea = document.querySelector('.shortcutKeysArea');
    shortcutKeysArea.innerHTML = '';

    // update the shortcut area with the current shortcut
    shortcutKeysArea.innerHTML = currentShortcutObject.shortcut.join(' + ');

  } // showShortcut()

  // function to hide areas
  function hideAreas(...areas) {

    if (areas.includes('shortcutArea')) {

      // select the existing shortcut area element
      shortcutArea = document.querySelector('.shortcutArea');
      shortcutArea.classList.add('hidden');
    }

    if (areas.includes('controlButtonsArea')) {

      // select the existing 'control buttons' area element
      controlButtonsArea = document.querySelector('.controlButtonsArea');
      controlButtonsArea.classList.add('hidden');
    }

    if (areas.includes('keyboardArea')) {

      // select the existing 'keyboard area' element
      keyboardArea = document.querySelector('.keyboardArea');
      keyboardArea.classList.add('hidden');
    }

    if (areas.includes('resultsArea')) {

      // select the existing 'results area' element
      resultsArea = document.querySelector('.resultsArea');
      resultsArea.classList.add('hidden');
    }

  } // hideAreas()

  // function to show hidden areas
  function unhideAreas(...areas) {

    if (areas.includes('shortcutArea')) {
      // select the existing shortcut area element
      shortcutArea = document.querySelector('.shortcutArea');
      shortcutArea.classList.remove('hidden');
    }

    if (areas.includes('controlButtonsArea')) {
      // select the existing 'control buttons' area element
      controlButtonsArea = document.querySelector('.controlButtonsArea');
      controlButtonsArea.classList.remove('hidden');
    }

    if (areas.includes('keyboardArea')) {
      // select the existing 'keyboard area' element
      keyboardArea = document.querySelector('.keyboardArea');
      keyboardArea.classList.remove('hidden');
    }

    if (areas.includes('resultsArea')) {
      // select the existing 'results area' element
      resultsArea = document.querySelector('.resultsArea');
      resultsArea.classList.remove('hidden');
    }

  } // unhideAreas()

  // function to check if there are the same values in two arrays
  function compareArrays(array1, array2) {

    // convert the arrays to sets so that we can easily check for membership
    let set1 = new Set(array1);
    let set2 = new Set(array2);

    // check if the size of the sets is not equal
    if (set1.size != set2.size) {

      return 'action';

    }

    // check if the sets have the same elements
    for (let element of set1) {

      if (!set2.has(element)) {

        // the sets are not equal
        return 'fail';

      }
    }

    // if we get here, then the sets are equal
    return 'success';

  } // compareArrays()

  // function to shuffle an array
  function shuffleArray(array) {

    // return the shuffled array
    return array.sort(() => Math.random() - 0.5);
    
  } // shuffleArray()

  // function to escape unsafe characters for html
  function escapeHTML(unsafe) {

    return unsafe
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\//g, '&#x2F;');

  } // escapeHTML()

  // function to unescape safe characters
  function unescapeHTML(safe) {

    return safe
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#039;/g, "'")
      .replace(/&#x2F;/g, '/');

  } // unescapeHTML()

  function searchAndReplaceAllStrings(input, replaceStringFunction) {

    try{
  
      // throw an error if replaceStringFunction is not a function
      if (typeof replaceStringFunction !== 'function') {
        throw new Error('searchAndReplaceAllStrings: replaceStringFunction must be a function.');
      }
  
      // check and handle all kinds of input
      if (typeof input === 'string') {
        return replaceStringFunction(input);
      } else if (Array.isArray(input)) {
        return input.map(item => searchAndReplaceAllStrings(item, replaceStringFunction));
      } else if (typeof input === 'object' && input !== null) {
        let result = {};
        for (let key in input) {
          if (typeof key === 'string') {
            key = replaceStringFunction(key);
          }
          result[key] = searchAndReplaceAllStrings(input[key], replaceStringFunction);
        }
        return result;
      } 
  
      // throw an error if the input is not a string, array or object
      throw new Error('searchAndReplaceAllStrings: input must be a string, array, object.');
  
    } catch (error) {
      console.error(error);
    }
  } // searchAndReplaceAllStrings()

  // set up the quiz
  quizSetup();

} // startFingerAcademy()
