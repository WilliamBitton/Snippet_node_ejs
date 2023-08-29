const snippet = require('../models/snippet')

// GET home page
exports.getHome = (req, res, next) => {
    const allTags = []
    snippet.find().sort({ createdAt: -1 })
        .then(allPosts => {
            for (const post of allPosts) {
                if (post.tags.length > 0) {
                    for (const tag of post.tags) {
                        if (tag != "") {
                            if (!allTags.includes(tag)) {
                                allTags.push(tag)
                            }
                            allTags.sort()
                        }
                    }
                }
            }
            res.render('index', {
                allPosts: allPosts,
                pageTitle: 'Accueil',
                allTags: allTags,
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
                console.log(err)
            }
        })
}

// POST home page
exports.postSearch = (req, res, next) => {
    const tag = req.body.tag
    res.redirect('search/' + tag)
}

// GET search/:tag page
exports.getSearch = (req, res, next) => {
    const tag = req.params.tag
    const allTags = []
    const action0 = snippet.find().sort({ createdAt: -1 }).exec()
    const action1 = snippet.find({ tags: tag }).sort({ createdAt: -1 }).exec()

    Promise.all([action0, action1])
        .then(results => {
            const allPosts = results[1]
            for (const post of results[0]) {
                if (post.tags.length > 0) {
                    for (const tag of post.tags) {
                        if (tag != "") {
                            if (!allTags.includes(tag)) {
                                allTags.push(tag)
                            }
                            allTags.sort()
                        }
                    }
                }
            }
            res.render('index', {
                allPosts: allPosts,
                pageTitle: 'Recherche ' + tag,
                allTags: allTags
            })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500
            }
        })
}

// GET add-snippet page
exports.getAdd = (req, res, next) => {
    res.render('add-snippet', {
        pageTitle: 'Ajouter un article',
        errorMessage: null
    })
}

// POST add-snippet
exports.postAdd = (req, res, next) => {
    const { title, content, url, tags } = req.body
    const tagsList = tags.split(" ")
    const tagsArray = []
    if (tagsList.length > 0) {
        for (const tag of tagsList) {
            if (tag != "") {
                if (!tagsArray.includes(tag)) {
                    tagsArray.push(tag)
                }
            }
        }
    }
    const newSnippet = new snippet({
        title: title,
        content: content,
        url: url,
        tags: tagsArray
    })

    newSnippet.save()
        .then(result => {
            res.redirect('/')
        })

        .catch(err => {
            return res.render('add-snippet', {
                pageTitle: 'Ajouter un article',
                errorMessage: err
            })
        })
}

// GET edit-snippet page
exports.getEdit = (req, res, next) => {
    const id = req.params.id
    snippet.findOne({ _id: id })
        .then(post => {
            const tags = post.tags.join(" ")
            res.render('edit-snippet', {
                post: post,
                tags: tags,
                pageTitle: 'Modifier un article',
                errorMessage: null
            })
        })
        .catch(err => {
            return res.render('edit-snippet', {
                pageTitle: 'Modifier un article',
                errorMessage: err
            })
        })
}

// POST edit-snippet/:id page
exports.postEdit = (req, res, next) => {
    const id = req.params.id
    const { title, content, url, tags } = req.body
    const tagsList = tags.split(" ")
    const tagsArray = []
    if (tagsList.length > 0) {
        for (const tag of tagsList) {
            if (tag != "") {
                if (!tagsArray.includes(tag)) {
                    tagsArray.push(tag)
                }
            }
        }
    }
    if (!title) {
        const err = new Error("Le titre est requis et doit être compris entre 1 et 255 caractères")
        err.statusCode = 400
        return snippet.findOne({ _id: id })
            .then(post => {
                const tags = post.tags.join(" ")
                res.render('edit-snippet', {
                    pageTitle: 'Modifier un article',
                    post: post,
                    tags: tags,
                    errorMessage: err
                })
            })
            .catch(err => {
                err.statusCode = 500
                console.log(err)
            })
    } else {
        snippet.findOneAndUpdate({ _id: id }, {
            title: title,
            content: content,
            url: url,
            tags: tagsArray
        })
            .then(result => {
                res.redirect('/')
            })
            .catch(err => {
                err.statusCode = 500
                console.log(err)
            })
    }

}

// GET delete-snippet/:id page
exports.getDel = (req, res, next) => {
    const id = req.params.id
    snippet.findOneAndRemove({ _id: id })
        .then(result => {
            res.redirect('/')
        })
        .catch(err => {
            err.statusCode = 500
            console.log(err)
        })
}