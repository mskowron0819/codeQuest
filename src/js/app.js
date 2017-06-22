var sortBy = require('sort-by');
import $ from "jquery";
$( window ).on( "load",() => {
   const movies = $('.movies');
   const moviesData = 'https://movie-ranking.herokuapp.com/movies';
   const aZ = $('#ascending');
   const zA = $('#descending');
   const intro = $('#intro');

    function getMovies() {
        movies.empty();
        $.ajax({
            url: moviesData,
            method: "GET",
            contentType: "application/json",
            cacheControl: "no-cache"
        }).done(function(response) {
            loadMovies(response);
        }).fail(function(error) {
            console.log(error);
        });
    }
    function sort() {
        $.ajax({
            url: moviesData,
            method: "GET",
            contentType: "application/json",
            cacheControl: "no-cache"
        }).done(function(response) {
            let data;
            aZ.click(function() {
                movies.empty();
                    data = response.sort(sortBy('title'));
                    loadMovies(data);
            });
            zA.click(function() {
                movies.empty();
                data = response.sort(sortBy('-title'));
                    loadMovies(data);
            });
        }).fail(function(error) {
            console.log(error);
        });
    }
    function loadMovies(data) {
            $(data).each(function () {
                const li = $('<li>');
                const h3 = $('<h3>').text(this.title);
                const img = $('<img>').attr('src', this.poster);
                const stars = $('<div class="rating"></div>');
                const ratingBox = $('<div class="rating-box"></div>');
                stars.attr('data-stars', '0');
                ratingBox.append(stars);
                for( let i=5; i>=1; i--){
                    const star = $(`<span data-rating=${i}>☆</span>`).hide();
                    stars.append(star);
                    $(img).click(function () {
                        $(this).parent().siblings().toggle();
                        $(this).toggleClass('poster-active');
                        $('.container').css('height', '100vh');
                        star.toggle();
                        $(this).parent().find('p').toggle();
                        intro.toggle();
                    })
                    $(star).bind('click', function(e){
                        adRating(this, id, ratingData);
                        $(this).parent().children().unbind('click');
                        const thanksPage = $('<div class="thank-you-page"></div>');
                        let p = $('<p>').text('Thank you for your vote!');;
                        thanksPage.append(p).show();
                        $('body').append(thanksPage);
                    });
                }
                li.append(h3, img, ratingBox);
                movies.append(li);
                const ratingData = `https://movie-ranking.herokuapp.com/movies/${this.id}/ratings`;
                const id = this.id;
                $.ajax({
                    url: ratingData
                }).done(function(data) {
                    loadRating(data, ratingBox,id);
                }).fail(function(error) {
                    console.log(error);
                });
            })
        }
    function adRating(star, id, url) {
        $(star).parent().attr('data-stars', $(star).data('rating'));
        $.ajax({
            url: url,
            data: JSON.stringify({movie_id: id, rating: $(star).data('rating')}),
            method: "POST",
            contentType: "application/json",
            cacheControl: "no-cache"
        })
    }
    function loadRating(movie, ratingBox, id) {
        let rating;
        let movieId;
        var sum = {}, counter = {};
        for (var i = 0; i < movie.length; i++) {
            movieId = movie[i].movie_id;
            if (!(movieId in sum)) {
                sum[movieId] = 0;
                counter[movieId] = 0;
            }
            sum[movieId] += movie[i].rating;
            counter[movieId]++;
        }
        for(movieId in sum) {
            rating = (sum[movieId] / counter[movieId]).toFixed(1) ;
        }
        if(id == movieId){
            var p = $('<p>').text(`${rating}/5`).hide();
            ratingBox.append(p);
        }
    };
    sort();
    getMovies();
});
