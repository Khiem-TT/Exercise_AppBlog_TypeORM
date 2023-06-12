"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const data_source_1 = require("./src/data-source");
const Blog_1 = require("./src/entity/Blog");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const port = 8000;
data_source_1.AppDataSource.initialize().then(connection => {
    const app = (0, express_1.default)();
    app.set('view engine', 'ejs');
    app.set('views', './src/views');
    app.use(body_parser_1.default.urlencoded({ extended: true }));
    app.use(body_parser_1.default.json());
    app.use(express_1.default.json());
    const blogRepo = connection.getRepository(Blog_1.Blog);
    app.get('/blog/list', async (req, res) => {
        const blogs = await blogRepo.find();
        res.render('list', { blogs: blogs });
    });
    app.get('/blog/create', (req, res) => {
        res.render('create');
    });
    app.post('/blog/create', upload.none(), async (req, res) => {
        const blogData = {
            title: req.body.title,
            content: req.body.content
        };
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
        res.render('blogdetail', { blog: blog[0] });
    });
    app.get('/blog/:id/delete', async (req, res) => {
        const blogId = +req.params.id;
        let blog = await blogRepo.findOneBy({ id: blogId });
        await blogRepo.remove(blog);
        res.redirect('/blog/list');
    });
    app.get('/blog/:id/update', async (req, res) => {
        const blogId = +req.params.id;
        let blog = await blogRepo.findOneBy({ id: blogId });
        res.render('update', { blog: blog });
    });
    app.post('/blog/:id/update', async (req, res) => {
        let { title, content } = req.body;
        let blogId = +req.params.id;
        let blog = await blogRepo.findOneBy({ id: blogId });
        blog.title = title;
        blog.content = content;
        await blogRepo.save(blog);
        res.redirect('/blog/list');
    });
    app.listen(port, () => {
        console.log(`Server is running at http://localhost:${port}`);
    });
});
//# sourceMappingURL=index.js.map