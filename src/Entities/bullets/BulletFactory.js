import Bullet from "./Bullet.js";

export default class BulletFactory{
    constructor(){

    }

    createBullet(bulletContext) {
        const bullet = new Bullet(bulletContext.angle)
        bullet.x = bulletContext.x;
        bullet.y = bulletContext.y; 

        return bullet;
    }
}