<template>  
  <div>
    <button @click="startGame">Start Game</button>
  </div>
</template>
<script>
// import kaplay from "kaplay";
// import chars from "@/assets/images/bag.png";

// kaplay(
//   {
//   top:0,
//    background: [120, 120, 120],
//   }
// );

// // Preload the sprite asset
// loadSprite("char", chars);

// // Desired sprite dimensions
// const desiredWidth = 64; // Set the width you want
// const desiredHeight = 64; // Set the height you want

// scene("game", () => {
//   // Add the character with the sprite and size adjustment
//   const char = add([
//     sprite("char", { width: desiredWidth, height: desiredHeight }), // Set sprite dimensions
//     pos(100, 100), // Initial position
//     area(), // Enable collision detection
//     body(),
//   ]);

//   // Add some obstacles
//   const obstacles = [
//     add([rect(1000, 50), pos(0, 200), color(1, 0, 0), body({isStatic: true}), area(), "obstacle"]),
//     add([rect(1300, 50), pos(0, 10), color(0, 1, 0), body({isStatic: true}), area(), "obstacle"]),
//     add([
//     sprite("char", { width: desiredWidth, height: desiredHeight }), pos(0, 400), color(1, 0, 0), area(), "obstacle"]
//     ),
    

//   ];

//   // Movement speed
//   const baseSpeed = 20000;

//   // Handle continuous movement with speed boost on Shift
//   onKeyDown("w", () => {
//     const speed = isKeyDown("shift") ? baseSpeed * 2 : baseSpeed; // Double speed if Shift is held
//     char.move(0, -speed * dt()); // Move up
//   });
//   onKeyDown("a", () => {
//     const speed = isKeyDown("shift") ? baseSpeed * 2 : baseSpeed;
//     char.move(-speed * dt(), 0); // Move left
//   });
//   onKeyDown("s", () => {
//     const speed = isKeyDown("shift") ? baseSpeed * 2 : baseSpeed;
//     char.move(0, speed * dt()); // Move down
//   });
//   onKeyDown("d", () => {
//     const speed = isKeyDown("shift") ? baseSpeed * 2 : baseSpeed;
//     char.move(speed * dt(), 0); // Move right
//   });

//   // Handle collision with obstacles
//   char.onCollide("obstacle", () => {
//     // Show an alert and reset the game
//     // alert("You touched an obstacle! Restarting...");
//     // window.location.reload();
//   });
// });

// // Start the "game" scene
// go("game");
</script>

<style lang="scss" scoped>
/* You can add specific styles here */
</style>
