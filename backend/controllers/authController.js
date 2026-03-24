const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const usersFile = path.join(__dirname, '../data/users.json');

const loadUsers = () => {
  const data = fs.readFileSync(usersFile, 'utf-8');
  return JSON.parse(data);
};

const saveUsers = (users) => {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
};

const signup = (req, res) => {
  const { email, password, name } = req.body;
  
  if (!email || !password || !name) {
    return res.status(400).json({ 
      error: 'Email, password, and name are required' 
    });
  }
  
  const users = loadUsers();
  
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ 
      error: 'User already exists' 
    });
  }
  
  const newUser = {
    id: `user-${uuidv4()}`,
    email,
    password,
    name,
    createdAt: new Date().toISOString(),
    role: 'candidate'
  };
  
  users.push(newUser);
  saveUsers(users);
  
  res.status(201).json({
    success: true,
    message: 'Signup successful',
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    }
  });
};

const login = (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ 
      error: 'Email and password are required' 
    });
  }
  
  const users = loadUsers();
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ 
      error: 'Invalid credentials' 
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Login successful',
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    token: `token-${uuidv4()}`
  });
};

module.exports = {
  signup,
  login
};
