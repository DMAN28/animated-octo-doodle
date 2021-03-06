const router = require('express').Router();
const { User } = require('../../models');

// GET  api users
router.get('/', (req, res) => {
// access user model .findAll method = to SELECT * FROM users;
User.findAll({ 
    attributes: { exclude: ['password']}
})
.then(dbUserData => res.json(dbUserData))
.catch(err =>{
    console.log(err);
    res.status(500).json(err);
    });
});

// GET  api users/1
router.get('/:id', (req, res) => {
    // Equal to SELECT * FROM users WHERE id = 1
    User.findOne({ 
      attributes: { exclude: ['password'] },
      where: {
        id: req.params.id
      }
    })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id' });
          return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
          res.status(400).json({ message: 'Incorrect password!' });
          return;
        }
    
        res.json({ user: dbUserData, message: 'You are now logged in!' });
      });
    });

  router.post('/', (req, res) => {
    // expects {username:'USERNAME', email: 'name@gmail.com', password: newpasscode12'"}

    User.create({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });
  

// POST  api users
router.post('/login', (req, res) => {
  //expects {email: 'lernantino@gmail.com', password: 'password1234'}
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: 'No user with that email address!' });
      return;
    }

    const validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({ message: 'Incorrect password!' });
      return;
    }

    res.json({ user: dbUserData, message: 'Log in successful!' });
  });
});

// PUT  api users/1
router.put('/:id', (req, res) => {  User.update(req.body, {

    //UPDATE users SET username = "'USERNAME', email= 'name@gmail.com', password= newpasscode12'"
    individualHooks: true,
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData[0]) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// DELETE api users/1
router.delete('/:id', (req, res) => {  User.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


module.exports = router;