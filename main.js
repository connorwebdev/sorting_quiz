const draggableList = document.getElementById('draggable-list'),
check = document.getElementById('check');

let films;

API_URL = 'https://api.themoviedb.org/3/discover/movie?api_key=5706d73325307f6d0d322076f4ba7ba2&sort_by=revenue.desc&include_adult=false&include_video=false&page=1';

fetch(API_URL)
  .then(response => response.json())
  .then(data => {
    const films = data;
	populateFilmsList(films);
  })
  .catch(error => console.error(error));


function populateFilmsList(films) {
	[...films.results]
		.filter((film,index) => {
			// Remove any films with innacurate earnings reports ie. student films saying they made more money than Avatar 
			if(film.popularity > 1 && film !== undefined){
				return film;
			}
		})
		.filter((film,index) => {
			// Get the first 10 films left over after filtering out duds.
			if(index < 10 && film !== undefined){
				return film;
			}
		})
		//Attach random number to each film as well as it's original index position
		.map((a,index) => ({value: a, sort: Math.random(), originalIndex: index}))
		//Change order based on random number (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
		.sort((a,b) => a.sort - b.sort)
		.forEach((film,index) => {
			const listItem = document.createElement('li');

			listItem.setAttribute('data-index',index);
			listItem.setAttribute('data-original-index',film.originalIndex);

			listItem.innerHTML = `
			<span class="number">${index + 1}</span>
			<div class="draggable" draggable="true" style="background-image:url(https://image.tmdb.org/t/p/original${film.value.backdrop_path});">
				<p class="filmName">${film.value.original_title}</p>
				<i class="fas fa-grip-lines"></i>
			</div>
			`;
			
			listItems.push(listItem);

			draggableList.appendChild(listItem);

			addEventListeners();
		})
}

// //Store list items
const listItems = [];
let dragStartIndex;

function dragStart() {
	dragStartIndex = +this.closest('li').getAttribute('data-index');
}

function dragOver(e) {
	e.preventDefault();
}

function dragDrop() {
	const dragEndIndex = +this.getAttribute('data-index');
	swapItems(dragStartIndex, dragEndIndex);

	this.classList.remove('over');
}

//Swap list items that are drag and drop
function swapItems(fromIndex, toIndex) {
	const itemOne = listItems[fromIndex].querySelector('.draggable');
	const itemTwo = listItems[toIndex].querySelector('.draggable');
	const listItemOne = listItems[fromIndex];
	const listItemTwo = listItems[toIndex];

	const listItemOneOriginalIndex = listItemOne.getAttribute('data-original-index');
	const listItemTwoOriginalIndex = listItemTwo.getAttribute('data-original-index');
	listItemOne.setAttribute('data-original-index', listItemTwoOriginalIndex);
	listItemTwo.setAttribute('data-original-index', listItemOneOriginalIndex);
	
	listItems[fromIndex].appendChild(itemTwo);
	listItems[toIndex].appendChild(itemOne);
}

function dragEnter() {
	this.classList.add('over');
}

function dragLeave() {
	this.classList.remove('over');
}

//Check the order of list items
function checkOrder() {
	
	listItems.forEach((listItem,index) => {
		const currentIndex = listItem.getAttribute('data-index');
		const orginalIndex = listItem.getAttribute('data-original-index');
		
		if(currentIndex !== orginalIndex){
			listItem.classList.remove('right');
			listItem.classList.add('wrong');
		} else {
			listItem.classList.remove('wrong');
			listItem.classList.add('right');
		}

	})
	checkForWin();
}

function checkForWin() {
	let win = true;
	listItems.forEach((listItem) => {
		if(listItem.classList.contains('wrong')){
			win = false;
		}
	})
	if(win){
		draggableList.classList.add('winner');
		window.scrollTo(0,document.body.scrollHeight);
	} else {
		draggableList.classList.remove('winner');
	}
}

function addEventListeners() {
	const draggables = document.querySelectorAll('.draggable');
	const dragListItems = document.querySelectorAll('.draggable-list li');

	draggables.forEach(draggable => {
		draggable.addEventListener('dragstart', dragStart);
	})

	dragListItems.forEach(item => {
		item.addEventListener('dragover', dragOver);
		item.addEventListener('drop', dragDrop);
		item.addEventListener('dragenter', dragEnter);
		item.addEventListener('dragleave', dragLeave);
	})

}

check.addEventListener('click', checkOrder);