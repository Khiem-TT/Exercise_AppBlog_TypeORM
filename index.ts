import {AppDataSource} from "./src/data-source";
import {Blog} from "./src/entity/Blog";
import multer from 'multer';

const upload = multer();
import express from 'express';
import bodyParser from 'body-parser';

const port = 8000;

AppDataSource.initialize().then(connection => {
    const app = express();
    app.set('view engine', 'ejs');
    app.set('views', './src/views');
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use(express.json());
    const blogRepo = connection.getRepository(Blog);

    app.get('/blog/list', async (req, res) => {
        const blogs = await blogRepo.find();
        res.render('list', {blogs: blogs});
    });
    app.get('/blog/create', (req, res) => {
        res.render('create');
    });
    app.post('/blog/create', upload.none(), async (req, res) => {
        const blogData = {
            title: req.body.title,
            content: req.body.content
        }

        await blogRepo.save(blogData);
        res.redirect('/blog/list');
    });
    app.get('/blog/:id/detail', async (req, res) => {
        const blogId = +req.params.id;
        const blog = await blogRepo.find({
            where: {
                id: blogId
            }
        });
        res.render('blogdetail', {blog: blog[0]});
    });
    app.get('/blog/:id/delete', async (req, res) => {
        const blogId = +req.params.id;
        let blog = await blogRepo.findOneBy({id: blogId});
        await blogRepo.remove(blog);
        res.redirect('/blog/list');
    });
    app.get('/blog/:id/update', async (req, res) => {
        const blogId = +req.params.id;
        let blog = await blogRepo.findOneBy({id: blogId});
        res.render('update', {blog: blog});
    });
    app.post('/blog/:id/update', async (req, res) => {
        let {title, content} = req.body;
        let blogId = +req.params.id;
        let blog = await blogRepo.findOneBy({id: blogId});
        blog.title = title;
        blog.content = content;
        await blogRepo.save(blog);
        res.redirect('/blog/list');
    });

    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});

