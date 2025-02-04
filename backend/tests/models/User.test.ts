import { User, IUser } from '../../models/User';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

describe('Modèle User', () => {
  // Test de création d'utilisateur
  it('devrait créer un nouvel utilisateur', async () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'motdepasse123'
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findOne({ email: userData.email });
    expect(foundUser).toBeTruthy();
    expect(foundUser?.username).toBe(userData.username);
  });

  // Test de hashage du mot de passe
  it('devrait hasher le mot de passe avant la sauvegarde', async () => {
    const userData = {
      username: 'passwordtest',
      email: 'password@example.com',
      password: 'motdepasse123'
    };

    const user = new User(userData);
    await user.save();

    // Vérifier que le mot de passe est différent de l'original
    expect(user.password).not.toBe(userData.password);
    
    // Vérifier que le mot de passe est bien hashé
    const isMatch = await bcrypt.compare(userData.password, user.password || '');
    expect(isMatch).toBeTruthy();
  });

  // Test de validation d'email unique
  it('ne devrait pas créer un utilisateur avec un email existant', async () => {
    const userData1 = {
      username: 'user1',
      email: 'unique@example.com',
      password: 'motdepasse123'
    };

    const userData2 = {
      username: 'user2',
      email: 'unique@example.com',
      password: 'autremotdepasse'
    };

    const user1 = new User(userData1);
    await user1.save();

    const user2 = new User(userData2);
    
    await expect(user2.save()).rejects.toThrow();
  });

  // Test de comparaison de mot de passe
  it('devrait comparer correctement les mots de passe', async () => {
    const userData = {
      username: 'compareuser',
      email: 'compare@example.com',
      password: 'motdepasse123'
    };

    const user = new User(userData);
    await user.save();

    // Test de comparaison réussie
    const isMatchCorrect = await user.comparePassword('motdepasse123');
    expect(isMatchCorrect).toBeTruthy();

    // Test de comparaison échouée
    const isMatchIncorrect = await user.comparePassword('mauvaismdp');
    expect(isMatchIncorrect).toBeFalsy();
  });

  // Test des champs optionnels OAuth
  it('devrait supporter les identifiants OAuth', async () => {
    const userData = {
      username: 'oauthuser',
      email: 'oauth@example.com',
      googleId: 'google123',
      facebookId: 'facebook456'
    };

    const user = new User(userData);
    await user.save();

    const foundUser = await User.findOne({ email: userData.email });
    expect(foundUser?.googleId).toBe('google123');
    expect(foundUser?.facebookId).toBe('facebook456');
  });
}); 