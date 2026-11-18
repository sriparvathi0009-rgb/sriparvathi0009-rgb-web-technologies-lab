// Lab Exercise 10: Using jQuery to fetch and display data from a hypothetical API that provides information about books
// In this example, when the "Load Books" button is clicked, an Ajax GET request is made using jQuery's $.ajax method
// to retrieve a list of books from a hypothetical API endpoint (https://api.example.com/books). The JSON response
// is then parsed, and a list of books (including titles and authors) is displayed on the webpage.

let loadedBooks = [];

$(document).ready(function() {

    // Toggle Code box
    $('#toggleCodeBtn').on('click', function() {
        $('#codeBlock').slideToggle(200);
        const icon = $('#codeToggleIcon');
        icon.text(icon.text() === '▼' ? '▲' : '▼');
    });

    // Load Books via jQuery's $.ajax method
    $('#loadBooksBtn').on('click', function() {
        const $btn = $(this);
        const $spinner = $btn.find('.spinner');
        const $btnText = $btn.find('.btn-text');

        $spinner.show();
        $btnText.text('Requesting $.ajax()...');
        $btn.prop('disabled', true);

        // Making the AJAX GET request using jQuery $.ajax()
        $.ajax({
            url: "books.json", // Represents hypothetical endpoint "https://api.example.com/books"
            type: "GET",
            dataType: "json",
            timeout: 5000,
            success: function(response) {
                loadedBooks = response;

                // Show status notification
                $('#statusMessage')
                    .html(`✓ Successfully retrieved <strong>${response.length} books</strong> from API endpoint via jQuery <code>$.ajax()</code>!`)
                    .addClass('info')
                    .fadeIn(300);

                // Populate category filter options
                populateCategories(loadedBooks);
                $('#filterControls').fadeIn(300);

                // Render books onto webpage
                renderBooks(loadedBooks);
            },
            error: function(xhr, status, errorThrown) {
                console.warn("API request fallback triggered: ", status, errorThrown);
                
                // Fallback books data in case of strict origin restriction in file preview
                const fallbackBooks = [
                    {
                        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
                        author: "Robert C. Martin",
                        category: "Software Engineering",
                        year: 2008,
                        pages: 464,
                        rating: 4.8,
                        summary: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees."
                    },
                    {
                        title: "Design Patterns: Elements of Reusable Object-Oriented Software",
                        author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
                        category: "Architecture & Patterns",
                        year: 1994,
                        pages: 395,
                        rating: 4.9,
                        summary: "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions."
                    },
                    {
                        title: "You Don't Know JS Yet: Get Started",
                        author: "Kyle Simpson",
                        category: "Web Development",
                        year: 2020,
                        pages: 142,
                        rating: 4.7,
                        summary: "Deep dive into JavaScript engine, scope, closures, and object models."
                    }
                ];
                loadedBooks = fallbackBooks;
                populateCategories(loadedBooks);
                $('#filterControls').fadeIn(300);
                renderBooks(fallbackBooks);
            },
            complete: function() {
                $spinner.hide();
                $btnText.text('Reload Books');
                $btn.prop('disabled', false);
            }
        });
    });

    // Clear Books
    $('#clearBooksBtn').on('click', function() {
        loadedBooks = [];
        $('#booksGrid').html(`
            <div class="empty-state">
                <span class="empty-icon">📖</span>
                <h3>Catalog Cleared</h3>
                <p>Click the <strong>"Load Books"</strong> button above to fetch book data again.</p>
            </div>
        `);
        $('#statusMessage').hide();
        $('#filterControls').hide();
    });

    // Search and Category Filter with jQuery
    $('#filterInput').on('keyup', applyFilter);
    $('#categoryFilter').on('change', applyFilter);

    function applyFilter() {
        const query = $('#filterInput').val().toLowerCase().trim();
        const selectedCat = $('#categoryFilter').val();

        const filtered = loadedBooks.filter(function(book) {
            const matchesQuery = book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query);
            const matchesCat = (selectedCat === 'all' || book.category === selectedCat);
            return matchesQuery && matchesCat;
        });

        renderBooks(filtered);
    }

    function populateCategories(books) {
        const categories = [...new Set(books.map(b => b.category))];
        const $catSelect = $('#categoryFilter');
        $catSelect.html('<option value="all">All Categories</option>');
        categories.forEach(function(cat) {
            $catSelect.append(`<option value="${cat}">${cat}</option>`);
        });
    }

    function renderBooks(books) {
        const $grid = $('#booksGrid');
        $grid.empty();

        if (books.length === 0) {
            $grid.html(`
                <div class="empty-state">
                    <span class="empty-icon">🔍</span>
                    <h3>No Matching Books Found</h3>
                    <p>Try searching for a different keyword or select another category filter.</p>
                </div>
            `);
            return;
        }

        // Loop over books and append card elements
        $.each(books, function(index, book) {
            const card = `
                <div class="book-card">
                    <div class="book-header">
                        <span class="book-category">${book.category || 'General'}</span>
                        <h3 class="book-title">${book.title}</h3>
                        <p class="book-author">✍️ by ${book.author}</p>
                    </div>
                    <p class="book-summary">${book.summary}</p>
                    <div class="book-meta">
                        <span>🗓️ Published: ${book.year || 'N/A'}</span>
                        <span class="book-rating">★ ${book.rating || '5.0'} / 5</span>
                    </div>
                </div>
            `;
            $grid.append(card);
        });
    }
});
