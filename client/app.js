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
    				<label>
    					<span>title</span>
    					<input value="${article.title}" oninput=${(event) => changeArticleParams('title', event, sectionIndex, articleIndex )} type="text" />
    				</label>
    				<label>
    					<span>author</span>
    					<input value="${article.author}" oninput=${(event) => changeArticleParams('author', event, sectionIndex, articleIndex )} type="text" />
    				</label>
    			</li>`;
    			
				/**
   				return html`<li class="article">
    				<label><span>title</span><input value="${article.title}" oninput=${(event) => changeArticleParams('title', event, sectionIndex, articleIndex )} type="text" /></label>
    				<label><span>author</span><input value="${article.author}" oninput=${(event) => changeArticleParams('author', event, sectionIndex, articleIndex )} type="text" /></label>
    				<label><span>content</span><textarea value="${article.content}" oninput=${(event) => changeArticleParams('content', event, sectionIndex, articleIndex )} /></label>
    				<label><span>url</span><input value="${article.url}" oninput=${(event) => changeArticleParams('url', event, sectionIndex, articleIndex )} type="text" /></label>
    				<label><span>file</span><input value="${article.file}" oninput=${(event) => changeArticleParams('file', event, sectionIndex, articleIndex )} type="text" /></label>
    			</li>`;
    			**/
			});

			return html`<li class="section">
				<label class="title">
					<span>title</span>
					<input value="${section.title}" oninput=${(event) => changeSectionsParams('title', event, sectionIndex)} type="text" />
				</label>
				<h3>articles</h3>
				<ul>${$articles}</ul>
				<button type="button" onclick=${() => addArticle(sectionIndex)}>add article</button>
			</li>`;
		});

		return html`
			<body>
				<style>
					* {
						box-sizing: border-box;
					}

					html {
						height: 100%;
						width: 100%
						overflow: hidden;

						font-size: 1em;
					}

					body {
						display: flex;
    					flex-direction: column;
    					height: 100%;
    					overflow: hidden;
    					margin: 0;
					}

					main {
						display: flex;
						height: 100%;
					}

					main section#book {
						flex-basis: 300px;
						flex-shrink: 0;
						flex-grow: 0;

						height: 100%;
						overflow-y: auto;

						background-color: #d8d18d;
					}

					main section#sections {
						flex-basis: 350px;
						flex-shrink: 0;
						flex-grow: 0;

						height: 100%;
						overflow-y: auto;

						background-color: #e6e1b2;
					}

					main section#article-detail {
						flex-grow: 1;
						flex-shrink: 0;

						height: 100%;
						overflow-y: auto;

						background-color: #f3f0d8;
					}

					h3 {
						margin-left: 10px;
						text-transform:uppercase;
						font-size: 90%;
					}

					fieldset {
						border: 0;
					}

					ul {
						list-style-type: none;
						padding: 0;
						margin: 0;
					}

					ul li.section {
						border-top: 1px solid #333;
						background-color: #DEDEDE;
					}

					ul li.section ul li.article {
						padding: 10px;
						border-top: 1px solid #A0A0A0;
						background-color: #EFEFEF;
					}

					ul li.section button {
						width: 100%;
    					padding: 5px 10px;
    					background-color: #f7f7f7;
    					border: 1px solid #DEDEDE;
					}

					label {
						display: flex;
						margin-top: 5px;
					}

					label span {
						flex-basis: 100px;
						flex-grow: 0;
						flex-shrink: 0;

						font-size: 90%;
					}

					label input,
					label textarea {
						flex-basis: 100px;
						flex-grow: 0;
						flex-shrink: 0;

						font-size: 90%;
					}

					ul li.section label {
						margin-top: 5px;
						margin-left: 10px;
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
					<section id="article-detail">
						TEST
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