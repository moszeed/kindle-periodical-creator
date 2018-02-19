(() => {
	'use strict';

	const html = require('choo/html')
	const choo = require('choo')
	const kindlePeriodical = require('kindle-periodical');

	const app = choo();
	app.use(bookStore);
	app.route('/', mainView);
	app.mount('body');

	function createMobi (bookData) {
		console.log(JSON.stringify(bookData, null, 2));
		// kindlePeriodical.create(bookData);
	}

	function quickSave (bookData) {
		localStorage.setItem('lastBookData', JSON.stringify(bookData));
	}

	function bookStore (state, emitter) {
		state.bookData = {
			"title"      : '',
		    "creator"    : '',
		    "publisher"  : '',
		    "subject"    : '',
		    "language"   : '',
		    "cover"      : '',
		    "description": '',
		    "sections"   : [{
		    	"title" : '',
		        "articles"  : [{
		            "title"  : '',
		            "author" : '',
		            "content": ''
		        }]
		    }]
		};

		let lastBookData = localStorage.getItem('lastBookData');
		if (lastBookData) {
			state.bookData = JSON.parse(lastBookData);
		}
	}

	function mainView (state, emit) {

		const $sections = state.bookData.sections.map((section, sectionIndex) => {
			const $articles = section.articles.map((article, articleIndex) => {
   				return html`<li class="article">
    				<label><span>title</span><input value="${article.title}" oninput=${(event) => changeArticleParams('title', event, sectionIndex, articleIndex )} type="text" /></label>
    				<label><span>author</span><input value="${article.author}" oninput=${(event) => changeArticleParams('author', event, sectionIndex, articleIndex )} type="text" /></label>
    				<label><span>content</span><textarea value="${article.content}" oninput=${(event) => changeArticleParams('content', event, sectionIndex, articleIndex )} /></label>
    				<label><span>url</span><input value="${article.url}" oninput=${(event) => changeArticleParams('url', event, sectionIndex, articleIndex )} type="text" /></label>
    				<label><span>file</span><input value="${article.file}" oninput=${(event) => changeArticleParams('file', event, sectionIndex, articleIndex )} type="text" /></label>
    			</li>`;
			});

			return html`<li class="section">
				<label><span>title</span><input value="${section.title}" oninput=${(event) => changeSectionsParams('title', event, sectionIndex)} type="text" /></label>
				<h3>articles</h3>
				<ul>${$articles}</ul>
				<button type="button" onclick=${() => addArticle(sectionIndex)}>add article</button>
			</li>`;
		});

		return html`
			<body>
				<style>
					main {
						display: flex;
					}

					main fieldset {
						border: none;
					}

					label {
						display: block;
					}

					label span {
						display: inline-block;
						vertical-align: top;
						width: 100px;
					}

					label textarea,
					label input {
						margin-bottom: 10px;
						width: 200px;
					}

					label textarea {
						height: 100px;
					}

					section#book {
						flex-basis: 400px;
						flex-shrink: 0;
						flex-grow: 0;
					}

					section#sections {
						flex-grow: 1;
						overflow: auto;
					}

					section#sections ul {
						margin: 0;
						padding: 0;
						list-style-type: none;
					}

					section#sections ul li.section {
						padding: 10px;
						flex-basis: 400px;
    					flex-shrink: 0;
    					border-left: 1px solid #A0A0A0;
					}

					section#sections ul li.section .article {
						background-color: #DEDEDE;
						border: 1px solid #A0A0A0;
						padding: 20px 10px 20px 30px;
						margin-bottom: 10px;
					}

					section#sections ul#sections {
						display: flex;
						flex-direction: column;
					}


				</style>
				<header>
					<h1>Create a .mobi EBook</h1>
				</header>
				<main>
					<section id="book">
						<h3>Book Params</h3>
						<fieldset>
							<label><span>title</span><input value="${state.bookData.title}" oninput=${(event) => changeBookParams('title', event)} type="text" /></label>
							<label><span>creator</span><input value="${state.bookData.creator}" oninput=${(event) => changeBookParams('creator', event)} type="text" /></label>
							<label><span>publisher</span><input value="${state.bookData.publisher}" oninput=${(event) => changeBookParams('publisher', event)} type="text" /></label>
							<label><span>subject</span><input value="${state.bookData.subject}" oninput=${(event) => changeBookParams('subject', event)} type="text" /></label>
							<label><span>language</span><input value="${state.bookData.language}" oninput=${(event) => changeBookParams('language', event)} type="text" /></label>
							<label><span>cover</span><input value="${state.bookData.cover}" oninput=${(event) => changeBookParams('cover', event)} type="text" /></label>
							<label><span>description</span><input value="${state.bookData.description}" oninput=${(event) => changeBookParams('description', event)} type="text" /></label>
						</fieldset>
						<button type="button" onclick=${() => createMobi(state.bookData)}>create</button>
					</section>
					<section id="sections">
						<h3>sections</h3>
						<ul id="sections">${$sections}</ul>
						<button type="button" onclick=${() => addSection()}>add section</button>
					</section>
				</main>
			</body>
		`

		function changeBookParams (param, event) {
			state.bookData[param] = event.target.value;
			quickSave(state.bookData);
		}

		function changeSectionsParams(param, event, sectionIndex) {
			state.bookData.sections[sectionIndex][param] = event.target.value;
			quickSave(state.bookData);
		}

		function changeArticleParams (param, event, sectionIndex, articleIndex) {
			state.bookData.sections[sectionIndex].articles[articleIndex][param] = event.target.value;
			quickSave(state.bookData);
		}

		function addSection () {
			state.bookData.sections.push({
		    	"title" : '',
		        "articles"  : [{
		            "title"  : '',
		            "author" : '',
		            "content": '',
		            "url"	 : '',
		            "file"	 : ''
		        }]
			});
			quickSave(state.bookData);
			emit('render');
		}

		function addArticle (sectionIndex) {
			state.bookData.sections[sectionIndex].articles.push({
	            "title"  : '',
	            "author" : '',
	            "content": ''
	        });
			quickSave(state.bookData);
			emit('render');
		}
	}

})();