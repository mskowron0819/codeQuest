var sortBy = require('sort-by');
$(() => {
   const repertuar = $('.repertuar');
   const moviesData = 'https://movie-ranking.herokuapp.com/movies';
   const aZ = $('#ascending');
   const zA = $('#descending');

    function getMovies() {
        repertuar.empty();
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
            repertuar.empty();
                data = response.sort(sortBy('title'));
                loadMovies(data);
        });
        zA.click(function() {
            repertuar.empty();
            data = response.sort(sortBy('-title'));
                loadMovies(data);
        });
    }).fail(function(error) {
        console.log(error);
    });
}
function loadMovies(data) {
        console.log()
        $(data).each(function () {
            const li = $('<li>');
            const h3 = $('<h3>').text(this.title);
            const img = $('<img>').attr('src', this.poster);

            const stars = $('<div>').attr('class', 'rating');
            stars.attr('data-stars', '0');
            for( let i=5; i>=1; i--){
                const star = $(`<span data-rating=${i}>☆</span>`).hide();
                stars.append(star);
                $(star).bind('click', function(e){
                    adRating(this, id, ratingData);
                    $(this).parent().children().unbind('click');
                    console.log($(star).siblings(), 'fef');
                });
                $(img).click(function () {
                    $(this).css('opacity','0.5');
                    $(this).parent().siblings().toggle();
                    console.log($(this).parent().siblings());
                    star.toggle();
                })
            }
            li.append(h3, img, stars);
            repertuar.append(li);
            const ratingData = `https://movie-ranking.herokuapp.com/movies/${this.id}/ratings`;
            const id = this.id;
            $.ajax({
                url: ratingData
            }).done(function(data) {
                loadRating(data, li,id);
            }).fail(function(error) {
                console.log(error);
            });
        })
    }
function adRating(a, b,url) {
    $(a).parent().attr('data-stars', $(a).data('rating'));
    $.ajax({
        url: url,
        data: JSON.stringify({movie_id: b, rating: $(a).data('rating')}),
        method: "POST",
        contentType: "application/json",
        cacheControl: "no-cache"
    })
        // .done(function () {
        //     getMovies();
        // });
}
function loadRating(movie, li,id) {
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
        rating = (sum[movieId] / counter[movieId]).toFixed(2) ;
    }
    if(id == movieId){
        var p = $('<p>').text(rating);
        li.append(p);
    }
};
    sort();
    getMovies();
});
