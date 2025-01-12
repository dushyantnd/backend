const express = require('express');
const router = express.Router();
const NewsPost = require('../models/NewsPost');
const NewsCategory = require('../models/NewsCategory');

const axios = require('axios');
const cheerio = require('cheerio');
const { title } = require('process');
// Create a new post
router.post('/', async (req, res) => {
    try {
        const post = new NewsPost(req.body);
        await post.save();
        res.status(201).json({ success: true, message: 'Post created successfully', data: post });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Get all posts (with pagination and sorting)
router.get('/', async (req, res) => {
    const { page = 1, limit = 9, sortBy = 'createdAt', order = 'desc' } = req.query;

    try {
        const posts = await NewsPost.find()
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalCount = await NewsPost.countDocuments();

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get a single post by ID
router.get('/:id', async (req, res) => {
    try {
        const post = await NewsPost.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get a single post by slug
router.get('/slug/:slug', async (req, res) => {
    try {
        const post = await NewsPost.findOne({ slug: req.params.slug });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, data: post });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// Get a single post by category
router.get('/category/:slug', async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;

    try {
        const cat = await NewsCategory.findOne({ slug: req.params.slug });
        const posts = await NewsPost.find({category_id:cat?._id})
            .sort({ [sortBy]: order === 'desc' ? -1 : 1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalCount = await NewsPost.countDocuments();

        res.status(200).json({
            success: true,
            data: posts,
            pagination: {
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: parseInt(page),
                pageSize: parseInt(limit),
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


// Update a post by ID
router.put('/:id', async (req, res) => {
    try {
        const updatedPost = await NewsPost.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, message: 'Post updated successfully', data: updatedPost });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
});

// Delete a post by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedPost = await NewsPost.findByIdAndDelete(req.params.id);
        if (!deletedPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, message: 'Post deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

/*_________________D_U__S__H________ Srub start from here ______Y_A_N_T___________*/
// Function to fetch HTML content of a web page
async function fetchHTML(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching the HTML:', error);
        return null;
    }
}

// Function to scrape data from the HTML content
function scrapeData(html) {
    const $ = cheerio.load(html);

    // Example: Scraping all the <a> tags and printing their href attribute
    // $('a').each((index, element) => {
    //     console.log($(element).attr('href'));
    // });
    $('.a-size-base').each((index, element) => {
        console.log($(element).text());
    });

}
// Post Scrub
router.post('/scrub/:web', async (req, res) => {
    try {
        const url = req.body.url;

        // Fetch HTML content and then scrape data
        fetchHTML(url)
            .then(html => {
                
                if (html) {
                    const $ = cheerio.load(html);
                    // Extract Recruitment Title
                    // const title = $('h2').first().text().trim();
                    // // Extract Important Dates
                    // const importantDates = [];
                    // $('h3:contains("Important Dates")')
                    //     .next('ul')
                    //     .find('li')
                    //     .each((index, element) => {
                    //         importantDates.push($(element).text().trim());
                    //     });
                    // // Extract Application Fee
                    // const applicationFee = [];
                    // $('h3:contains("Application Fee")')
                    //     .next('ul')
                    //     .find('li')
                    //     .each((index, element) => {
                    //         applicationFee.push($(element).text().trim());
                    //     });

                    // // Extract Vacancy Details
                    // const vacancyDetails = [];
                    // $('h3:contains("Vacancy Details")');
                    // $("table tbody tr").each((_, row) => {
                    // const cells = $(row).find("td");
                    // if (cells.length === 2) {
                    //     const postName = $(cells[0]).text().trim();
                    //     const noOfPosts = $(cells[1]).text().trim();
                    //     if (postName && noOfPosts) {
                    //     vacancyDetails.push({ postName, noOfPosts });
                    //     }
                    // }
                    // });/
                    const data = {};
                    let currentKey = null;
                    let title = null;
                    const importantDates = [];
                    const applicationFee = [];
                    const ageLimit = [];
                    title = $('h2').first().text().trim();
                    // Extract Important Dates
                   
                    $('h3:contains("Important Dates")')
                        .next('ul')
                        .find('li')
                        .each((index, element) => {
                            importantDates.push($(element).text().trim());
                        });
                    // Extract Application Fee
                   
                    $('h3:contains("Application Fee")')
                        .next('ul')
                        .find('li')
                        .each((index, element) => {
                            applicationFee.push($(element).text().trim());
                        });


                        $('h3:contains("Age Limit")')
                        .next('ul')
                        .find('li')
                        .each((index, element) => {
                            ageLimit.push($(element).text().trim());
                        });


                    $("table tbody tr").each((_, row) => {

                    
                        const h3 = $(row).find("h3");
                        const cells = $(row).find("td");
                      
                        // If the row contains an h3, update the current key
                        if (h3.length) {
                          currentKey = h3.text().trim();
                          if (!data[currentKey]) {
                            data[currentKey] = [];
                          }
                        }
                      
                        // If the row contains two cells and a current key is set, add the data
                        if (currentKey && cells.length === 2) {
                          const postName = $(cells[0]).text().trim();
                          const noOfPosts = $(cells[1]).text().trim();
                          if (postName && noOfPosts) {
                            data[currentKey].push({ postName, noOfPosts });
                          }
                        }
                      });
                      // Remove empty keys from the data object
                        Object.keys(data).forEach((key) => {
                            if (data[key].length === 0) {
                            delete data[key];
                            }
                        });
                    res.status(200).json({ success: true, data: {title,importantDates,applicationFee,ageLimit,details:data} });
                } else {
                    res.status(200).json({ success: true, data: html });
                }
            })
            .catch(error => {
                res.status(200).json({ success: false, data: error });
            });

    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});


module.exports = router;
