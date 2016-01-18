/*

    MAIN GAME APP FILE

*/

var PonyInvandersBackgroundLayer = cc.Layer.extend({

    background_image: null,

    ctor: function() {
        this._super();

        this.background_image = new cc.Sprite(res.Background_img);
        this.background_image.setPosition(cc.p(
            cc.winSize.width / 2,
            cc.winSize.height / 2
            ));
        this.addChild(this.background_image);
    },

});


var TestLayer = cc.Layer.extend({

    ctor: function() {
        this._super();
    },

});


var PonyInvandersMainLayer = cc.Layer.extend({
    /*
        SPRITES
    */
    fluttershy_sprite: null,
    chrysalis_sprites: [],
    projectile_sprites: [],
    cigans: [],
    cigan_anim_frames: [],

    hud_elements: {
        gameover_text: null,
        gameover_panel: null,
        restart_btn: null
    },

    pony_state: {
        move_up: false,
        move_down: false
    },

    game_state: {
        running: true,
        display_defeat: false,
        score_display: null,
        score: 0,
        game_speed: 1
    },

    MoveUp: function() {
        this.pony_state.move_up = true;
        this.pony_state.move_down = false;
    },

    MoveDown: function() {
        this.pony_state.move_up = false;
        this.pony_state.move_down = true;
    },

    Stop: function() {
        this.pony_state.move_up = false;
        this.pony_state.move_down = false;
    },

    Fire: function(x,y) {
        var new_projectile_sprite = new cc.Sprite(res.Projectile_gif);
        new_projectile_sprite.setPosition(x, y);
        this.addChild(new_projectile_sprite);
        this.projectile_sprites.push(new_projectile_sprite);
        cc.audioEngine.playEffect(res.Shot_sound);
    },

    SpawnEnemy: function() {
        if (this.game_state.running) {
            var new_enemy = new cc.Sprite(res.Enemy_img);
            var enemy_x = (cc.winSize.width / 1.5) + ((cc.winSize.width / 2) * Math.random());
            var enemy_y = cc.winSize.height * Math.random();
            new_enemy.setPosition(cc.p(
                enemy_x,
                enemy_y
                ));
            this.chrysalis_sprites.push(new_enemy);
            this.addChild(new_enemy);
        };
    },

    PrepareCiganFrames: function() {
        var sprite_frames = [];
        for (var i = 0; i < 30; i++) {
            var new_frame = new cc.SpriteFrame(res.Cigan_frames, cc.rect(i * 80, 0, 80, 100));
            sprite_frames.push(new_frame);
        };

            var animFrames = [];
            for (var i = 0; i < 30; i++) {
                var animFrame = new cc.AnimationFrame(
                    sprite_frames[i], 
                    1, 
                    null
                    );
                animFrames.push(animFrame);
            };
        this.cigan_anim_frames = animFrames;
    },

    GetCiganAnimationAction: function() {
        var animation = new cc.Animation(this.cigan_anim_frames, 0.2);
        var animate   = cc.animate(animation);
        var animate_loop = new cc.RepeatForever(animate);
        return animate_loop;
    },

    RollCigans: function() {
        if (this.cigans.length > 0) {
            var roll_count = Math.floor(this.cigans.length / 5) + 1;
            for (var i = 0; i < roll_count; i++) {
                var cigan_index = Math.floor(this.cigans.length * Math.random());
                var x = Math.floor(100 * Math.random() - 50);
                var y = Math.floor(100 * Math.random() - 50);
                var move_action = new cc.MoveBy(1, cc.p(x, y));
                this.cigans[cigan_index].runAction(move_action);
            };
        };
    },

    SpawnCigan: function(x, y) {
        var sprite = new cc.Sprite();
        sprite.setPosition(cc.p(x, y));
        this.cigans.push(sprite);
        this.addChild(sprite);

        var animate_loop = this.GetCiganAnimationAction();

        sprite.runAction(animate_loop);
    },

    DisplayGameover: function() {
        var text = new ccui.Text();
        text.attr({
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            fontSize: 72,
            string: "ЗАНОВО ",
            x: cc.winSize.width / 2,
            y: cc.winSize.height / 2
        });
        this.hud_elements.gameover_text = text;

        var panel = new cc.Sprite(res.Gameover_panel);
        panel.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2));
        this.hud_elements.gameover_panel = panel;

        this.addChild(panel, 10);
        this.addChild(text, 11);

        var restart_btn = new ccui.Button();
        restart_btn.loadTextures(res.Restart_btn_normal, res.Restart_btn_clicked);
        restart_btn.setPosition(cc.p((cc.winSize.width / 2) + (cc.winSize.height * 0.3), cc.winSize.height / 2));
        restart_btn.addTouchEventListener(this.RestartGame, this);
        this.hud_elements.restart_btn = restart_btn;
        this.addChild(restart_btn, 11);

        this.game_state.display_defeat = true;
    },

    CreateScoreDisplay: function() {
        var score_panel = new cc.Sprite(res.Score_panel);
        score_panel.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height * 0.1));

        var score = new ccui.Text();
        score.attr({
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            fontSize: 52,
            string: "СЧЕТ: " + this.game_state.score.toString(),
            x: cc.winSize.width / 2,
            y: cc.winSize.height * 0.1
        });

        this.addChild(score_panel, 10);
        this.addChild(score, 10);
        this.game_state.score_display = {
            panel: score_panel,
            score: score
        };
    },

    UpdateScoreDisplay: function() {
        this.game_state.score_display.score.attr({
            textAlign: cc.TEXT_ALIGNMENT_CENTER,
            fontSize: 52,
            string: "СЧЕТ: " + this.game_state.score.toString(),
            x: cc.winSize.width / 2,
            y: cc.winSize.height * 0.1
        });
        cc.audioEngine.setMusicVolume(this.game_state.score / 1000.0);
    },

    RestartGame: function() {
        local_layer = this;
        this.chrysalis_sprites.forEach(function(item, i, arr) {
            local_layer.removeChild(item);
        });
        this.projectile_sprites.forEach(function(item, i, arr) {
            local_layer.removeChild(item);
        });
        this.cigans.forEach(function(item, i, arr) {
            local_layer.removeChild(item);
        });
        this.chrysalis_sprites = [];
        this.projectile_sprites = [];
        this.cigans = [];
        this.game_state.running = true;
        this.game_state.display_defeat = false;
        this.game_state.score = 0;
        this.game_state.game_speed = 1;
        this.UpdateScoreDisplay();
        this.removeChild(this.hud_elements.gameover_text);
        this.removeChild(this.hud_elements.gameover_panel);
        this.removeChild(this.hud_elements.restart_btn);
        cc.audioEngine.playEffect(res.Button_press);
    },

    KeyPressedHandler: function(key, event) {
                            switch(key) {
                                case 38:
                                    this.MoveUp();
                                    break;
                                case 40:
                                    this.MoveDown();
                                    break;
                                case 32:
                                    this.Fire(
                                        this.fluttershy_sprite.x,
                                        this.fluttershy_sprite.y
                                        );
                                    break;
                            }
                        },

    KeyReleasedHandler: function(key, event) {
                            switch(key) {
                                case 38:
                                    this.Stop();
                                    break;
                                case 40:
                                    this.Stop();
                                    break;
                            }
                        },

    PlayBackgroundMusic: function() {
        cc.audioEngine.playMusic(res.Background_music, true);
        cc.audioEngine.setMusicVolume(0.0);
    },

    ctor: function() {
        /*
            CALL SUPERCLASS'S INIT METHOD
        */
        this._super();

        /*
            LOAD SPRITES
        */
        this.fluttershy_sprite = new cc.Sprite(res.Player_img);
        this.fluttershy_sprite.setPosition(cc.p(150, cc.winSize.height / 2));
        this.addChild(this.fluttershy_sprite);

        /*
            SETUP KEYBOARD
        */
        if (cc.sys.capabilities.hasOwnProperty("keyboard")) {
            cc.eventManager.addListener({
                event: cc.EventListener.KEYBOARD,

                onKeyPressed: this.KeyPressedHandler.bind(this),

                onKeyReleased: this.KeyReleasedHandler.bind(this),

            }, 
            this);
        };

        /*
            INIT CIGAN'S ANIMATION
        */
        this.PrepareCiganFrames();

        /*
            DIFFERENT PREPARATIONS
        */
        this.PlayBackgroundMusic();
        this.CreateScoreDisplay();

        this.scheduleUpdate();
        this.schedule(this.SpawnEnemy, 1);
        this.schedule(this.RollCigans, 0.5);
    },

    update: function(dt) {
        if (this.game_state.running) {
            if (this.pony_state.move_up) {
                if (this.fluttershy_sprite.y <= cc.winSize.height) {
                    this.fluttershy_sprite.y += 1000 * dt;
                };
            };
            if (this.pony_state.move_down) {
                if (this.fluttershy_sprite.y >= 0) {
                    this.fluttershy_sprite.y -= 1000 * dt;
                };
            };

            var new_projectile_sprites = [];
            for (var i = 0; i < this.projectile_sprites.length; i++) {
                if (this.projectile_sprites[i].x >= cc.winSize.width) {
                    this.removeChild(this.projectile_sprites[i]);
                }
                else {
                    this.projectile_sprites[i].x += 2000 * dt;

                    var new_chrysalis_sprites = [];
                    for (var j = 0; j < this.chrysalis_sprites.length; j++) {
                        if (
                            (Math.abs(this.projectile_sprites[i].x - this.chrysalis_sprites[j].x) < 75) &&
                            (Math.abs(this.projectile_sprites[i].y - this.chrysalis_sprites[j].y) < 75)
                            ) {
                            this.SpawnCigan(
                                this.chrysalis_sprites[j].x,
                                this.chrysalis_sprites[j].y
                                );
                            cc.audioEngine.playEffect(res.Hit_sound);
                            this.removeChild(this.chrysalis_sprites[j]);
                            this.game_state.score += 10;
                            this.game_state.game_speed += 0.1;
                            this.UpdateScoreDisplay();
                        }
                        else {
                            new_chrysalis_sprites.push(this.chrysalis_sprites[j]);
                        };
                    };
                    this.chrysalis_sprites = new_chrysalis_sprites;

                    new_projectile_sprites.push(
                        this.projectile_sprites[i]
                        );
                };
            };
            this.projectile_sprites = new_projectile_sprites;

            for (var i = 0; i < this.chrysalis_sprites.length; i++) {
                this.chrysalis_sprites[i].x -= 100 * this.game_state.game_speed * dt;
                if (this.chrysalis_sprites[i].x <= 0) {
                    this.game_state.running = false;
                };
            }
        }
        else {
            if (!this.game_state.display_defeat) {
                this.DisplayGameover();
            };
        };
    }
})

var MainScene = cc.Scene.extend({
    onEnter:function () {
        /*
            CALL SUPERCLASS'S INIT METHOD
        */
        this._super();

        /*
            INIT SCENE
        */
        var background_layer = new PonyInvandersBackgroundLayer();
        var main_layer = new PonyInvandersMainLayer();
        this.addChild(background_layer);
        this.addChild(main_layer);
        // var tl = new TestLayer();
        // this.addChild(tl);
    }
});

