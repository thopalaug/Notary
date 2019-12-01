//Load a book from disk

function loadBook(filename, displayName){
	
	let currentBook = "";
	let url = "books/" + filename;

	//Reset the UI
	document.getElementById("fileName").innerHTML = displayName;
	document.getElementById("searchstat").innerHTML = "";
	document.getElementById("keyword").value = "";
	
	
	//Server request for books
	var xhr = new XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.send();
	
	/*
	ReadyStates
	0 = unsent
	1 = file open
	2 = recieved header
	3 = loading file
	4 = process done
	
	HTTP status 200 = all good
	
	*/
	xhr.onreadystatechange = function(){
		if(xhr.readyState == 4 && xhr.status == 200){
			currentBook = xhr.responseText;

			getDocStats(currentBook);

			currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g,'<br>');
			
			document.getElementById("fileContent").innerHTML = currentBook;
			
			var elmnt = document.getElementById("fileContent");
			elmnt.scrollTop = 0;
		}
		
	};
	
}


//handle stats from book
function getDocStats(fileContent){

	var docLength = document.getElementById("doclength");
	var wordCount = document.getElementById("wordCount");
	var charCount = document.getElementById("charCount");

	let text = fileContent.toLowerCase();

	//regex to find each word
	let wordArray = text.match(/\b\S+\b/g);

	let wordDictionary = {};


	var uncommomWords = [];

	uncommomWords = filterStopWords(wordArray);




	//Count every word in the array
	for( let word in uncommomWords){
		let wordValue = uncommomWords[word];
		if(wordDictionary[wordValue] > 0){
			wordDictionary[wordValue] += 1;
		}else{
			wordDictionary[wordValue] = 1;
		}
	}

	let wordList = sortProperties(wordDictionary);

	//top 5 words found
	var top5Words = wordList.slice(0, 6);

	//least used 5 words
	var least5Words = wordList.slice(-6, wordList.length);

	ULTemplate(top5Words, document.getElementById('mostUsed'));
	ULTemplate(least5Words, document.getElementById('leastUsed'));


	//docLength.innerText = "Document Length: " + text.length;
	wordCount.innerText = "Word count: " + wordArray.length;


}

function ULTemplate(items,element){
	let rowTemplate = document.getElementById('template-ul-items');
	let templateHTML = rowTemplate.innerHTML;
	let resultsHTML = "";

	for(i=0;i<items.length-1;i++){
		resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
	}

	element.innerHTML = resultsHTML;
}


function sortProperties(object){

	let returnArray = Object.entries(object);

	returnArray.sort(function (first, second){
		return second[1] - first[1];
	})

	return returnArray;

}

//filter out the stop words
function filterStopWords(wordArray){

	var commonWords = getStopWords();
	var commonObject = {};
	var uncommonArray = [];

	for(i = 0;i < commonWords.length; i++){
		commonObject[commonWords[i].trim()] = true;
	}
	for(i=0; i < wordArray.length; i++){
		word = wordArray[i].trim().toLowerCase();
		if(!commonObject[word]){
			uncommonArray.push(word);
		}
	}
	return uncommonArray;

}


//the most used non-unique words. Not relevant for the word count. 
//will be used to filter out.
function getStopWords(){
	return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

//highlight the search word in the text
function performMark(){

	var keyword = document.getElementById("keyword").value;
	var display = document.getElementById("fileContent");

	var newContent = "";

	let spans = document.querySelectorAll('mark');

	//locates mark taggs, and return whatever is between them.
	for(var i = 0; i < spans.length; i++){
		spans[i].outerHTML = spans[i].innerHTML;
	}

	var re = new RegExp(keyword, "gi");
	var replaceText = "<mark id='markme'>$&</mark>";
	var bookContent = display.innerHTML;

	newContent = bookContent.replace(re,replaceText);

	display.innerHTML = newContent;
	var count = document.querySelectorAll('mark').length;
	document.getElementById("searchstat").innerHTML = "found " + count + " matches.";

	if (count > 0){
		var element = document.getElementById("markme");
		element.scrollIntoView();
	};
}