var res = {
    Player_img : "res/Rainbow_dash.png",
    Enemy_img : "res/Chrysalis.png",
    Projectile_gif : "res/Cigan.png",
    Background_img : "res/Background.png",
    Background_tutorial_img : "res/Background_tutorial.png",
    Background_music : "res/Cigan.mp3",
    Cigan_frames : "res/CiganAnimated.png",
    Score_panel : "res/Score_panel.png",
    Restart_btn_clicked : "res/restart_button_clicked.png",
    Restart_btn_normal : "res/restart_button_normal.png",
    Gameover_panel : "res/Gameover_panel.png",
    Shot_sound : "res/shot.wav",
    Hit_sound : "res/hit.wav",
    Button_press : "res/button_press.wav",
};

var g_resources = [];

for (var i in res) {
    g_resources.push(res[i]);
}
