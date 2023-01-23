function getData(endpoint) {
    return fetch(endpoint)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

const messagesPromise = getData("/api/messages");
const postsPromise = getData("/api/posts");
const usersPromise = getData("/api/users");

Promise.all([messagesPromise, postsPromise, usersPromise])
    .then(([messages, posts, users]) => {
        console.log(JSON.stringify(messagesPromise));
        console.log(postsPromise);
        console.log(usersPromise);
        // render the admin.ejs template and pass in the data
        // res.render('admin', { messages, posts, users });
        // you can use the data here to display the messages, posts and users
    })
    .catch((error) => console.error(error));
