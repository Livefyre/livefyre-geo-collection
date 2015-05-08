var test = require('blue-tape');
var streamBodyToStates = require('../src/stream-body-to-states');

test('stream-body-to-states', function (t) {
  var streamBody = getStreamBody();
  var states = streamBodyToStates(streamBody);
  t.equal(states.length, 2);
  states.forEach(function (state) {
    t.ok(state.content, 'has .content');
    t.equal(typeof state.content.bodyHtml, 'string', 'has .content.bodyHtml');
    t.ok(state.content.author.id, 'has author object');
  });
  t.end();
})

function getStreamBody() {
  return {
    "status": "ok",
    "code": 200,
    "data": {
      "states": {
        "tweet-596400722259869696@twitter.com": {
          "vis": 1,
          "collectionId": "74714636",
          "content": {
            "attachments": [
              {
                "url": "http://pbs.twimg.com/media/CEbWddyWoAAVTlU.png",
                "type": "photo"
              }
            ],
            "generator": {
              "url": "",
              "image": "",
              "displayName": "",
              "id": "twitter.com"
            },
            "bodyHtml": "<p>RT @LarrySabato: Today's Crystal Ball: 11 things to know about the Electoral College in our 1st look at 2016. <a href=\"http://www.centerforpolitics.org/crystalball/articles/the-map-11-angles-on-the-electoral-college/\" target=\"_blank\" rel=\"nofollow\">http://www.centerforpolitics.org/crystalball/articles/the-map-11-angles-on-the-electoral-college/</a> http:/…</p>",
            "id": "tweet-596400722259869696@twitter.com",
            "authorId": "21313053@twitter.com",
            "parentId": "",
            "updatedAt": 1431030317,
            "annotations": {
              "tweetMeta": {
                "language": "en",
                "tweetIdStr": "596400722259869696",
                "created_at": "Thu May 07 19:46:27 +0000 2015",
                "retweeted_status_id": 596399802847465500,
                "tweetId": 596400722259869700,
                "in_reply_to_screen_name": "",
                "verified_user": false,
                "retweet_count": 26
              },
              "sortOrder": 1431030317.07937
            },
            "createdAt": 1431027987
          },
          "source": 20,
          "lastVis": 0,
          "type": 0,
          "event": 1431030317125498
        },
        "tweet-596400722259869696-1@twitter.com": {
          "vis": 1,
          "collectionId": "74714636",
          "content": {
            "attachments": [
              {
                "url": "http://pbs.twimg.com/media/CEbWddyWoAAVTlU.png",
                "type": "photo"
              }
            ],
            "generator": {
              "url": "",
              "image": "",
              "displayName": "",
              "id": "twitter.com"
            },
            "bodyHtml": "<p>RT @LarrySabato: Today's Crystal Ball: 11 things to know about the Electoral College in our 1st look at 2016. <a href=\"http://www.centerforpolitics.org/crystalball/articles/the-map-11-angles-on-the-electoral-college/\" target=\"_blank\" rel=\"nofollow\">http://www.centerforpolitics.org/crystalball/articles/the-map-11-angles-on-the-electoral-college/</a> http:/…</p>",
            "id": "tweet-596400722259869696-1@twitter.com",
            "authorId": "21313053@twitter.com",
            "parentId": "",
            "updatedAt": 1431030317,
            "annotations": {
              "tweetMeta": {
                "language": "en",
                "tweetIdStr": "596400722259869696-1",
                "created_at": "Thu May 07 19:46:27 +0000 2015",
                "retweeted_status_id": 596399802847465500,
                "tweetId": 596400722259869700,
                "in_reply_to_screen_name": "",
                "verified_user": false,
                "retweet_count": 26
              },
              "sortOrder": 1431030317.07937
            },
            "createdAt": 1431027987
          },
          "source": 20,
          "lastVis": 0,
          "type": 0,
          "event": 1431030317125498
        }
      },
      "authors": {
        "21313053@twitter.com": {
          "displayName": "Larry Sabato",
          "tags": [],
          "profileUrl": "//twitter.com/LarrySabato",
          "avatar": "https://pbs.twimg.com/profile_images/378800000334253663/c4b250bbedc7befcd56673b7652e2b3d_normal.jpeg",
          "type": 3,
          "id": "21313053@twitter.com"
        }
      },
      "annotations": {},
      "colAnnotations": {},
      "maxEventId": 1431030317125498
    }
  }
}
