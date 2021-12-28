
// IDK how the fuck this works but including the notw.json file in the <src> in the index.html lets me load this :shrug:
var notw_json;
var wmf_json;
// console.log((notw_json));

// Creates a dictionary of each chapter & the relevant paragraph numbers that contain the word we care about
function find_chapter_paragraphs_of_word(word, book_json){
    
    var matching_chapter_par_dict  = {}
    // Iterate over each chapter
    for (const [chapter, paragraph_array] of Object.entries(book_json)) {
        matching_paragraphs = []
        // Iterate over each paragraph in the chapter
        for (const [index, paragraph] of paragraph_array.entries()){
            if (paragraph.toLowerCase().includes(word.toLowerCase())){
                // Store the paragraph number if it has the word
                matching_paragraphs.push(index)
            }
        // Store our array of matching paragraphs asociated with the chapter
        matching_chapter_par_dict[chapter] = matching_paragraphs
        }
    }
      // Logging testing purposes
    //   console.log(matching_chapter_par_dict)
    return matching_chapter_par_dict
}

// Allow for flexibility to look at x paragraphs before/after each matching paragraph
function get_buffer_paragraphs(matching_chapter_par_dict, book_json, paragraph_buffer){
    //Get the explicit list of matching paragraphs
    var buffer_paragraphs = {}
    // iterate over each chapter
    for (const [chapter, paragraph_array] of Object.entries(matching_chapter_par_dict)) {
        // create array of numbers plus/minus our buffer from the exact matching paragraphs
        // duplicates are ok, so are negative and numbers beyond total paragraphs in chapter
        // will make unique, sort & limit afterwards
        relevant_chapters = []
        // console.log(chapter)
        // look at each paragraph that had the relevant word
        for (paragraph_number of paragraph_array) {
            //probably a more conscise way to do this...
            ///going back to COMP101 with the for loop
            for (var i=0; i <= paragraph_buffer; i++) {
                // get paragraphs before & after 
                relevant_chapters.push(paragraph_number + i)
                relevant_chapters.push(paragraph_number - i)
            }
        }
        // Now make unique, sort & limit (so we don't go beyond max paragraphs in chapter)
        var unique_chapters = [...new Set(relevant_chapters)]
        var max_chapter = book_json[chapter].length
        var filtered_chapters = unique_chapters.filter(function(x) {
            return x >= 0 && x < max_chapter;
        })
        // var sorted_chapters = filtered_chapters.sort()
        // javascript will treat the numbers as strings, gotta do this so 40 comes before 100
        var sorted_chapters = filtered_chapters.sort(function (a, b) {  return a - b;  })

        //only store if array has something in it
        if (sorted_chapters.length > 0){
            buffer_paragraphs[chapter] = sorted_chapters
        }
    }
    return buffer_paragraphs
}

function get_paragraph_text_dict(chapter_par_dict, book_json){
    paragraph_text_dict = {}
    for (const [chapter, paragraph_array] of Object.entries(chapter_par_dict)) {
        //probably a better way than a double for loop, but....
            paragraph_text_array = []
        for (paragraph_number of paragraph_array){
            paragraph_text_array.push(paragraph_number + ': ' + book_json[chapter][paragraph_number])
        }
        // console.log(paragraph_text_array)
        paragraph_text_dict[chapter] = paragraph_text_array
    }
    return paragraph_text_dict
}

function prettify_paragraph_text_dict(paragraph_text_dict){
    raw_text = []
    for (const [chapter, paragraph_array] of Object.entries(paragraph_text_dict)) {
        raw_text.push(chapter)
        raw_text.push(paragraph_array.join('<br>'))
    }
    raw_text = raw_text.join('<br>')
    return raw_text
}

function get_text_from_search_word(word, book_json, buffer_paragraphs){
    var matching_chapter_par_dict = find_chapter_paragraphs_of_word(word, book_json)
    var buffer_paragraphs = get_buffer_paragraphs(matching_chapter_par_dict, book_json, buffer_paragraphs)
    var paragraph_text_dict = get_paragraph_text_dict(buffer_paragraphs, book_json)
    raw_text = prettify_paragraph_text_dict(paragraph_text_dict)
    return raw_text
}

const book_json_mapping = {"name_of_the_wind" : notw_json, "wise_mans_fear": wmf_json}
let book_json;
var book_selector = document.getElementById("book_name_selector")
book_selector.addEventListener("change", function(){
    selected_book = book_selector.value
    book_json = book_json_mapping[selected_book]
    console.log(selected_book)
    console.log(book_json)
})




var search_word = document.getElementById("search_word");
var buffer_paragraphs = document.getElementById("buffer_paragraphs");
var search_button = document.getElementById("search_button")

search_button.addEventListener("click", function () {
    console.log(selected_book)
    var text = get_text_from_search_word(search_word.value, book_json, buffer_paragraphs.value)
    document.getElementById("book_text_div").innerHTML = text
    ///unhide the div since it starts out hidden
    document.getElementById("book_text_div").style.display = "block";
});