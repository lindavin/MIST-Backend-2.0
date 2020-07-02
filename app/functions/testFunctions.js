// Returns a promise that checks if user owns something
userOwnsPromise = (userid, objectid, model) => {
    // Store our models in an Object (maybe look into something possibly more efficient in the future)
    // will help to create a genealized doesOwn function since everything has 
    // besides the userSchema has userid
    return (Models[model].
        findById(objectid).
        where('userId').equals(userid).countDocuments().exec())
}

// const userOwnsTest = userOwnsPromise('5efd140f5f0ef435a02538e2', '5efdf0f34cc6d44109e1df14', 'Album');
// userOwnsTest.
//   then((thing)=>console.log(thing)).
//   catch((err)=>console.log("Our error: " + err));
const userid = '5efd140f5f0ef435a02538e2';
const imageid = '5efe00efb268b473704cad42';
let userQuery = User.findById(userid).or([{ admin: true }, { moderator: true }, { images: { $elemMatch: { $eq: imageid } } }]).countDocuments().exec();
let userOwns = userOwnsPromise(userid, imageid, 'Image');
Promise.all([userQuery, userOwns]).
    then((values) => {
        console.log(values);
    });

const Models = {
    "Image": Image,
    "Comment": Comment,
    "Album": Album,
    "Challenge": Challenge,
    "Workspace": Workspace,
    "Flag": Flag,
}
