/**
 * BookVerse - Core Application JavaScript
 * Manages Mock Book Data, Rendering, Search, Filtering, and Navigation UI.
 */

// Initial Mock Dataset for Books across Categories
const BOOKS_DATA = [
    {
        id: 1,
        title: "Clean Code: A Handbook of Agile Software Craftsmanship",
        author: "Robert C. Martin",
        category: "Programming",
        price: 34.99,
        rating: 4.8,
        featured: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=500&q=80",
        description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code."
    },
    {
        id: 2,
        title: "Introduction to Algorithms (4th Edition)",
        author: "Thomas H. Cormen, Charles E. Leiserson",
        category: "Computer Science",
        price: 89.99,
        rating: 4.9,
        featured: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=500&q=80",
        description: "A comprehensive update of the leading textbook on algorithms, featuring new material on matchings in bipartite graphs, online algorithms, and machine learning."
    },
    {
        id: 3,
        title: "The Lean Startup",
        author: "Eric Ries",
        category: "Business",
        price: 21.50,
        rating: 4.6,
        featured: false,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=500&q=80",
        description: "Most startups fail. But many of those failures are preventable. The Lean Startup is a new approach being adopted across the globe, changing the way companies are built."
    },
    {
        id: 4,
        title: "Dune",
        author: "Frank Herbert",
        category: "Science Fiction",
        price: 18.99,
        rating: 4.8,
        featured: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=500&q=80",
        description: "Set on the desert planet Arrakis, Dune is the story of Paul Atreides—who would become known as Muad'Dib—and of a great family's ambition to bring to fruition humankind's most ancient dream."
    },
    {
        id: 5,
        title: "Atomic Habits",
        author: "James Clear",
        category: "Self Development",
        price: 24.00,
        rating: 4.9,
        featured: true,
        bestseller: true,
        image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?auto=format&fit=crop&w=500&q=80",
        description: "No matter your goals, Atomic Habits offers a proven framework for improving every day. James Clear reveals practical strategies that will teach you how to form good habits and break bad ones."
    },
    {
        id: 6,
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        category: "History",
        price: 22.99,
        rating: 4.7,
        featured: false,
        bestseller: false,
        image: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=500&q=80",
        description: "From a renowned historian comes a groundbreaking narrative of humanity's creation and evolution—a #1 international bestseller that explores how Biology and History have defined us."
    }
];

// Initialize application data in localStorage if not already set
function initBooksStorage() {
    if (!localStorage.getItem('bv_books')) {
        localStorage.setItem('bv_books', JSON.stringify(BOOKS_DATA));
    }
}

function getAllBooks() {
    initBooksStorage();
    return JSON.parse(localStorage.getItem('bv_books'));
}

// Global DOM Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
    initBooksStorage();
    setupMobileMenu();
    setupSearchHandlers();

    // Context-sensitive page rendering
    if (document.getElementById('featuredBooksContainer')) renderHomePage();
    if (document.getElementById('allBooksContainer')) renderBooksPage();
    if (document.getElementById('bookDetailsContainer')) renderBookDetailsPage();
});

// Mobile Nav Toggle
function setupMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }
}

// Search Handler
function setupSearchHandlers() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    const handleSearch = () => {
        const query = searchInput.value.trim();
        if (query) {
            window.location.href = `books.html?search=${encodeURIComponent(query)}`;
        }
    };

    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', handleSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSearch();
        });
    }
}

// Render Book Card HTML Component
function createBookCardHTML(book) {
    return `
        <div class="book-card">
            <div class="book-cover">
                <span class="book-category-tag">${book.category}</span>
                <a href="book-details.html?id=${book.id}">
                    <img src="${book.image}" alt="${book.title}">
                </a>
            </div>
            <div class="book-details">
                <h3 class="book-title"><a href="book-details.html?id=${book.id}">${book.title}</a></h3>
                <span class="book-author">by ${book.author}</span>
                <div class="book-footer">
                    <span class="book-price">$${parseFloat(book.price).toFixed(2)}</span>
                    <button type="button" class="btn-add-cart" onclick='addToCart(${JSON.stringify(book)})'>
                        <i class="fa-solid fa-cart-plus"></i> Add
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Render Home Page Sections
function renderHomePage() {
    const featuredContainer = document.getElementById('featuredBooksContainer');
    const bestSellersContainer = document.getElementById('bestSellersContainer');

    const books = getAllBooks();

    if (featuredContainer) {
        const featuredBooks = books.filter(b => b.featured);
        featuredContainer.innerHTML = featuredBooks.map(b => createBookCardHTML(b)).join('');
    }

    if (bestSellersContainer) {
        const bestSellers = books.filter(b => b.bestseller);
        bestSellersContainer.innerHTML = bestSellers.map(b => createBookCardHTML(b)).join('');
    }
}

// Render Books Catalog Page with Dynamic Filtering & Sorting
function renderBooksPage() {
    const container = document.getElementById('allBooksContainer');
    const categoryFilter = document.getElementById('categoryFilter');
    const sortBy = document.getElementById('sortBy');
    const pageSearchInput = document.getElementById('pageSearchInput');
    const noResults = document.getElementById('noResults');

    if (!container) return;

    let books = getAllBooks();
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    const searchParam = urlParams.get('search');

    if (categoryParam && categoryFilter) {
        categoryFilter.value = categoryParam;
    }

    if (searchParam && pageSearchInput) {
        pageSearchInput.value = searchParam;
    }

    function filterAndDisplay() {
        let filtered = [...books];
        const selectedCat = categoryFilter ? categoryFilter.value : 'All';
        const searchQuery = (pageSearchInput ? pageSearchInput.value : (searchParam || '')).toLowerCase().trim();
        const sortOption = sortBy ? sortBy.value : 'featured';

        // Filter by Category
        if (selectedCat !== 'All') {
            filtered = filtered.filter(b => b.category.toLowerCase() === selectedCat.toLowerCase());
        }

        // Filter by Search Term
        if (searchQuery) {
            filtered = filtered.filter(b => 
                b.title.toLowerCase().includes(searchQuery) ||
                b.author.toLowerCase().includes(searchQuery) ||
                b.category.toLowerCase().includes(searchQuery)
            );
        }

        // Sort Data
        if (sortOption === 'price-low') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (sortOption === 'price-high') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'rating') {
            filtered.sort((a, b) => b.rating - a.rating);
        }

        // Render Results
        if (filtered.length === 0) {
            container.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
        } else {
            if (noResults) noResults.style.display = 'none';
            container.innerHTML = filtered.map(b => createBookCardHTML(b)).join('');
        }
    }

    // Attach Event Listeners
    if (categoryFilter) categoryFilter.addEventListener('change', filterAndDisplay);
    if (sortBy) sortBy.addEventListener('change', filterAndDisplay);
    if (pageSearchInput) pageSearchInput.addEventListener('input', filterAndDisplay);

    filterAndDisplay();
}

// Render Single Book Details Page
function renderBookDetailsPage() {
    const container = document.getElementById('bookDetailsContainer');
    const breadcrumbTitle = document.getElementById('breadcrumbTitle');
    if (!container) return;

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = parseInt(urlParams.get('id'), 10);

    const books = getAllBooks();
    const book = books.find(b => b.id === bookId) || books[0];

    if (breadcrumbTitle) breadcrumbTitle.textContent = book.title;

    container.innerHTML = `
        <div class="book-details-grid">
            <div class="details-image-col">
                <img src="${book.image}" alt="${book.title}" class="details-cover">
            </div>
            <div class="details-info-col">
                <span class="badge">${book.category}</span>
                <h1 class="details-title">${book.title}</h1>
                <p class="details-author">By <strong>${book.author}</strong></p>
                <div class="details-rating">
                    <span class="rating-stars"><i class="fa-solid fa-star"></i> ${book.rating} / 5.0</span>
                    <span class="rating-count">(128 customer reviews)</span>
                </div>
                <div class="details-price">$${parseFloat(book.price).toFixed(2)}</div>
                <p class="details-description">${book.description}</p>
                
                <div class="details-actions">
                    <div class="quantity-picker">
                        <label for="detailQty">Qty:</label>
                        <input type="number" id="detailQty" value="1" min="1" max="10">
                    </div>
                    <button type="button" class="btn btn-primary btn-lg" id="addDetailToCartBtn">
                        <i class="fa-solid fa-cart-plus"></i> Add to Shopping Cart
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById('addDetailToCartBtn')?.addEventListener('click', () => {
        const qty = parseInt(document.getElementById('detailQty').value, 10) || 1;
        addToCart(book, qty);
    });
}