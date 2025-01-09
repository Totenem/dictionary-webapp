const fetchDictioanryData = async (inputWord) => {
    try {
        const dictionaryResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${inputWord}`);
        
        // If response is not OK (like 404), show error message
        if (!dictionaryResponse.ok) {
            document.querySelector('.result').innerHTML = `
                <div class="error-message">
                    <h3>😕</h3>
                    <h3>No Definitions Found</h3>
                    <p>Sorry, we couldn't find definitions for the word "${inputWord}".</p>
                </div>
            `;
            return;
        }

        // successfuly found a word right here
        const dictionaryData = await dictionaryResponse.json();
        console.log(dictionaryData);
        useData(dictionaryData);
    } catch (err) { //for idk type of error s in fecthing
        console.log(err);
        document.querySelector('.result').innerHTML = `
            <div class="error-message">
                <h3>😕</h3>
                <h3>An error occurred</h3>
                <p>Sorry, something went wrong. Please try again later.</p>
            </div>
        `;
    }
};

const getSearchWord = () => {
    const inputField = document.getElementById('search');
    const inputWord = inputField.value;
    return inputWord;
}

const search = document.getElementById('search-btn');
search.addEventListener("click", async () => {
    const inputWord = getSearchWord();
    fetchDictioanryData(inputWord);
})

const useData = (dictionaryData) => {
    let word, text, audio, partOfSpeech, definition; //initilize tthem to be used for deault values (when theres no search yet and when theres a search results already)

    if (dictionaryData) {
        // Existing code for handling dictionary data
        const [{ word: w, phonetics, meanings }] = dictionaryData;
        word = w;
        
       // I notice that not every word have the same structure on where they have both the audio and
       // text. this makes it ahrder for me to deconstruct it. so isntead ona direct approach i made a quick
      // for loop to the phonetics part and find the first text and audio.
        text = '';
        audio = '';
        for (const phonetic of phonetics) {
            if (phonetic.text && phonetic.audio) {
                text = phonetic.text;
                audio = phonetic.audio;
                break;
            }
        }

        const [{ partOfSpeech: pos, definitions }] = meanings;
        const [{ definition: def }] = definitions;
        partOfSpeech = pos;
        definition = def;
    } else {
        // Default values when no search
        word = "code";
        text = "/kəʊd/";
        audio = "https://api.dictionaryapi.dev/media/pronunciations/en/code-uk.mp3";
        partOfSpeech = "noun";
        definition = "A short symbol, often with little relation to the item it represents.";
    }

    document.querySelector('.result').innerHTML = `
        <span id="word">${word}</span>        
        <button id="audio-btn">
            <audio id="audio" src="${audio}"></audio>
            🔊
        </button>
        <p class="part-of-speech">${partOfSpeech} ${text}</p>
        <p class="definition">${definition}</p>
    `;
    const audioBtn = document.getElementById('audio-btn');
    const audioElement = document.getElementById('audio');
    
    audioBtn.addEventListener('click', () => {
        audioElement.play();
    });
}

useData();
