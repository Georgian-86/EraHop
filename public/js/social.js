class SocialFeed {
  constructor(containerId, hashtag) {
    this.container = document.getElementById(containerId);
    this.hashtag = hashtag;
    this.posts = [];
    if (document.querySelector('.social-feed')) {
      this.init();
    }
  }

  async init() {
    try {
      await this.fetchPosts();
      this.render();
      if (typeof this.initSharing === 'function') {
        await this.initSharing();
      }
    } catch (error) {
      console.error('Social feed initialization error:', error);
    }
  }

  async fetchPosts() {
    // In a real app, fetch from social media APIs
    this.posts = [
      {
        id: 1,
        username: '@timeexplorer',
        content: 'Just visited the prehistoric era! #TimeFest2025',
        image: '/images/social/post1.jpg',
        likes: 245,
        platform: 'twitter',
      },
      // Add more sample posts
    ];
  }

  render() {
    this.container.innerHTML = `
            <div class="social-feed-header">
                <h3>Join the Conversation</h3>
                <p>Share your experience using #${this.hashtag}</p>
            </div>
            <div class="social-feed-grid">
                ${this.posts.map((post) => this.renderPost(post)).join('')}
            </div>
            <div class="social-share-buttons">
                ${this.renderShareButtons()}
            </div>
        `;
  }

  renderPost(post) {
    return `
            <div class="social-post ${post.platform}">
                <div class="post-header">
                    <img src="/images/avatars/default.png" alt="${
                      post.username
                    }" class="avatar">
                    <span class="username">${post.username}</span>
                </div>
                ${
                  post.image
                    ? `<img src="${post.image}" alt="Post image" class="post-image">`
                    : ''
                }
                <p class="post-content">${post.content}</p>
                <div class="post-footer">
                    <button class="like-button" onclick="socialFeed.likePost(${
                      post.id
                    })">
                        <i class="fas fa-heart"></i>
                        <span>${post.likes}</span>
                    </button>
                    <span class="platform-icon">
                        <i class="fab fa-${post.platform}"></i>
                    </span>
                </div>
            </div>
        `;
  }

  renderShareButtons() {
    return `
            <button onclick="socialFeed.share('twitter')">
                <i class="fab fa-twitter"></i> Tweet
            </button>
            <button onclick="socialFeed.share('facebook')">
                <i class="fab fa-facebook"></i> Share
            </button>
            <button onclick="socialFeed.share('instagram')">
                <i class="fab fa-instagram"></i> Share
            </button>
        `;
  }

  share(platform) {
    const text = `Join me at Time Fest 2025! #${this.hashtag}`;
    const url = window.location.href;

    switch (platform) {
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            text
          )}&url=${url}`
        );
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case 'instagram':
        // Instagram doesn't support direct sharing via URL
        alert('Share your photos on Instagram with #' + this.hashtag);
        break;
    }
  }

  likePost(postId) {
    const post = this.posts.find((p) => p.id === postId);
    if (post) {
      post.likes++;
      this.render();
    }
  }
}
