import { GameManager } from './SweetBonanza/Managers/GameManager'

GameManager.GetInstance().StartGame().then( ()=>
{
  console.log('game started');
});