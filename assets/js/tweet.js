const tweets = [];
    const SaveTweet = document.querySelector("#SaveTweet");
    const tweetInput = document.getElementById("tweetInput");
    const TweetList = document.getElementById("TweetList");
    const charCount = document.getElementById("charCount");

    
    tweetInput.addEventListener("input", function () {
      const remainingChars = 250 - tweetInput.value.length;
      charCount.textContent = remainingChars;
      charCount.style.color = remainingChars < 20 ? "red" : "gray"; 
    });

    SaveTweet.addEventListener("click", function () {
      if (tweetInput.value.trim().length === 0) {
        alert("Tweet boş olamaz!");
        return;
      }

      if (tweetInput.value.trim().length > 250) {
        alert("Tweet 250 karakterden uzun olamaz!");
        return;
      }

      let newId = 1;
      if (tweets[tweets.length - 1]) {
        newId = tweets[tweets.length - 1].id + 1;
      }

      const newTweet = {
        id: newId,
        title: tweetInput.value,
        isLiked: false,
        likes: 0,
      };
      tweets.push(newTweet);
      tweetInput.value = "";
      charCount.textContent = 250; 
      charCount.style.color = "gray";
      render();
    });

    function render() {
      TweetList.innerHTML = "";
      for (const tweet of tweets) {
        TweetList.innerHTML += `
        <li>
          <p>${tweet.title}</p>
          <i class="fas fa-trash deleteTweetBtn" data-id="${tweet.id}"></i>
          <i class="fas fa-heart likeBtn ${tweet.isLiked ? "liked" : ""}" data-id="${tweet.id}"></i>
          <span>${tweet.likes}</span>
        </li>`;
      }
      bindElements();
    }

    function bindElements() {
      const deleteTweetBtns = document.querySelectorAll(".deleteTweetBtn");
      const likeBtns = document.querySelectorAll(".likeBtn");

      for (const deleteTweetBtn of deleteTweetBtns) {
        deleteTweetBtn.addEventListener("click", function (e) {
          e.preventDefault();
          deleteTweet(parseInt(e.target.dataset.id));
        });
      }

      for (const likeBtn of likeBtns) {
        likeBtn.addEventListener("click", function (e) {
          toggleLike(parseInt(e.target.dataset.id));
        });
      }
    }

    function deleteTweet(id) {
      if (confirm("Silmek istediğinize emin misiniz?")) {
        const tweetIndex = tweets.findIndex((tweet) => tweet.id === id);
        if (tweetIndex > -1) {
          tweets.splice(tweetIndex, 1);
        }
        render();
      }
    }

    function toggleLike(id) {
      const tweet = tweets.find((tweet) => tweet.id === id);
      if (tweet) {
        tweet.isLiked = !tweet.isLiked;
        tweet.likes = tweet.isLiked ? 1 : 0;
        render();
      }
    }

    render();