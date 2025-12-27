const Blog = require('../models/blog')

const initialBlogs = [
	{
    title: 'Java ist auch eine Insel',
    author: 'Christian Ullenboom',
    url: 'https://openbook.rheinwerk-verlag.de/javainsel/',
		likes: 7,
	},
	{
		title: 'Go To Statement Considered Harmful',
		author: 'Edsger W. Dijkstra',
		url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
		likes: 5,
	},
]

module.exports = {
	initialBlogs,
}
