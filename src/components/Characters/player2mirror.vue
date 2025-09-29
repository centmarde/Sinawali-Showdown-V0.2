<template>
  <div class="canvas-container">
    <!-- Canvas for Player 2's animations, toggles moveLeft class based on isattack state -->
    <canvas id="canvas" ref="canvas1" :class="{ moveLeft: isattack }"></canvas>
    <v-row>
      <v-col class="d-flex justify-content-center">
      <!--   <button @click="toggleHurtInjured">Hurt (Injured)</button>
        <button @click="toggleHurtSkinDamage">Hurt (Skin Damage)</button>
        <button @click="toggleBuff">Buff</button>
        <button @click="toggleAttack">attack</button>   -->
      </v-col>
    </v-row>
  </div>
</template>

<script>
import playerImageSrc from '@/assets/anim/man2.png';
import { io } from "socket.io-client";

export default {
  data() {
    return {
      isattack: false,
      animationFrame: null,
      buffActive: false,
      hurtActive: false,
      socket: null,
      frameX: 0,
      frameY: 0,
      gameFrame: 0,
      staggerFrames: 10,
      isAnimating: false,
    };
  },
  mounted() {
    this.socket = io("http://localhost:3002");
    const canvas = this.$refs.canvas1;
    const ctx = canvas.getContext("2d");
    const CANVAS_WIDTH = (canvas.width = 600);
    const CANVAS_HEIGHT = (canvas.height = 600);
    const playerImage = new Image();
    playerImage.src = playerImageSrc;
    const spriteWidth = 575;
    const spriteHeight = 523;

    const drawPlayer = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
      ctx.drawImage(
        playerImage,
        this.frameX * spriteWidth,
        this.frameY * spriteHeight,
        spriteWidth,
        spriteHeight,
        CANVAS_WIDTH / 2 - spriteWidth / 2,
        CANVAS_HEIGHT / 2 - spriteHeight / 2,
        spriteWidth,
        spriteHeight
      );
    };

    const emitSocketEvent = (eventName, data) => {
      this.socket.emit(eventName, data);
    };

    const idle = () => {
      this.frameY = 0;
      drawPlayer();

      // Emit the idle animation event to the server when it's running
      if (this.gameFrame % this.staggerFrames === 0) {
        this.frameX = this.frameX < 3 ? this.frameX + 1 : 0;
        // Emit idle event every time the frame updates
        emitSocketEvent("animation_update2", {
          animation: "idle",
          frameX: this.frameX,
        });
      }

      this.gameFrame++;
      this.animationFrame = requestAnimationFrame(idle);
    };

    const buff = () => {
      if (!this.buffActive) {
        // Stop the animation if buff is not active
        if (this.isAnimating) {
          this.isAnimating = false;
          cancelAnimationFrame(this.animationFrame);
          idle(); // Call idle to reset player animation
        }
        return;
      }

      this.frameY = 5; // Set frameY for the buff animation state
      drawPlayer(); // Draw the player with the current frame

      if (this.gameFrame % this.staggerFrames === 0) {
        // Cycle through frames 0 to 4, reset to 0 when reaching the end
        this.frameX = this.frameX < 4 ? this.frameX + 1 : 0;

        // If frameX completes a cycle, deactivate buff and reset animation
        if (this.frameX === 0) {
          this.buffActive = false;
          this.isAnimating = false;
          cancelAnimationFrame(this.animationFrame);
          idle(); // Call idle function for default animation
          return; // Exit the function after deactivating buff
        }
        cancelAnimationFrame(this.animationFrame); // Stop the animation loop
        // Ensure socket emit happens only once per cycle/frame
        if (!this.isEmitting) {
          // Emit socket event with current animation state
          emitSocketEvent("buff2", {
            animation: "buff",
            frameX: this.frameX,
            frameY: this.frameY,
          });
          this.isEmitting = true; // Set the emitting flag
        }
      } else {
        this.isEmitting = false; // Reset the emitting flag when it's time for the next frame
      }

      this.gameFrame++; // Increment the game frame
      this.animationFrame = requestAnimationFrame(buff); // Continue the animation loop
    };

    const hurtAnimation = (animationFrameY) => {
      if (!this.hurtActive) return;
      this.frameY = animationFrameY;
      drawPlayer();
      if (this.gameFrame % 70 === 0) {
        this.frameX = this.frameX < 1 ? this.frameX + 1 : 0;
        if (this.frameX === 0) {
          this.hurtActive = false;
          cancelAnimationFrame(this.animationFrame);
          idle();

          this.isAnimating = false; // Reset animation flag
          return;
        }
      }
      cancelAnimationFrame(this.animationFrame);
      emitSocketEvent("hurt2", {
        animation: "hurt2",
        frameX: this.frameX,
        frameY: this.frameY,
      });
      this.gameFrame++;
      this.animationFrame = requestAnimationFrame(() =>
        hurtAnimation(animationFrameY)
      );
    };

    const attack1 = () => {
      if (!this.isattack) {
        if (this.isAnimating) {
          this.isAnimating = false;
          cancelAnimationFrame(this.animationFrame);
          idle();
        }
        return;
      }

      this.frameY = 2;
      drawPlayer();

      if (this.gameFrame % this.staggerFrames === 0) {
        this.frameX = this.frameX < 7 ? this.frameX + 1 : 0;
      }

      if (this.frameX === 7) {
        this.frameX = 0;
        this.isattack = false;
        this.isAnimating = false;
        cancelAnimationFrame(this.animationFrame);
        idle();

        return;
      }
      emitSocketEvent("attack2", {
        animation: "attack2",
        frameX: this.frameX,
        frameY: this.frameY,
      });
      cancelAnimationFrame(this.animationFrame);
      this.gameFrame++;
      this.animationFrame = requestAnimationFrame(attack1);
    };
    const attack2 = () => {
      if (!this.isattack) return;
      this.frameY = 3;
      drawPlayer();
      if (this.gameFrame % this.staggerFrames === 0)
        this.frameX = this.frameX < 5 ? this.frameX + 1 : 0;
      this.gameFrame++;
      emitSocketEvent("attack2", {
        animation: "attack2",
        frameX: this.frameX,
        frameY: this.frameY,
      });
      if (this.frameX < 5) {
        this.animationFrame = requestAnimationFrame(attack2);
      } else {
        this.frameX = 0;
        this.isattack = false;
        idle();
        this.isAnimating = false; // Reset animation flag
      }
    };

    const attack3 = () => {
      if (!this.isattack) {
        if (this.isAnimating) {
          this.isAnimating = false;
          cancelAnimationFrame(this.animationFrame);
          idle();
        }
        return;
      }

      this.frameY = 9;
      drawPlayer();

      if (this.gameFrame % this.staggerFrames === 0) {
        this.frameX = this.frameX < 6 ? this.frameX + 1 : 0;
      }

      if (this.frameX === 6) {
        this.frameX = 0;
        this.isattack = false;
        this.isAnimating = false;
        cancelAnimationFrame(this.animationFrame);
        idle();

        return;
      }
      emitSocketEvent("attack2", {
        animation: "attack3",
        frameX: this.frameX,
        frameY: this.frameY,
      });
      cancelAnimationFrame(this.animationFrame);
      this.gameFrame++;
      this.animationFrame = requestAnimationFrame(attack3);
    };

    this.toggleAttack = () => {
      if (this.isAnimating) return; // Prevent starting a new attack if an animation is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.isattack = true;
      this.frameX = 0;
      const randomAttack = Math.floor(Math.random() * 2);
       if (randomAttack === 0) {
      attack3();
       } else if (randomAttack === 1) {
        attack1();
      }
    };

    this.toggleHurt = () => {
      if (this.isAnimating) return; // Prevent starting a new hurt animation if one is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.frameX = 0;
      this.hurtActive = true;
      hurtAnimation(4);
    };

    this.toggleHurtInjured = () => {
      if (this.isAnimating) return; // Prevent starting a new hurt injured animation if one is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.frameX = 0;
      this.hurtActive = true;
      hurtAnimation(6.1);
      emitSocketEvent("hurt_injured", {
        animation: "injured",
        frameX: this.frameX,
        frameY: this.frameY,
      });
    };

    this.toggleHurtSkinDamage = () => {
      if (this.isAnimating) return; // Prevent starting a new hurt skin damage animation if one is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.frameX = 0;
      this.hurtActive = true;
      hurtAnimation(7.1);
      emitSocketEvent("hurt_skin_damage", {
        animation: "skin_damage",
        frameX: this.frameX,
        frameY: this.frameY,
      });
    };

    this.toggleBuff = () => {
      if (this.isAnimating) return; // Prevent starting a new buff animation if one is already running
      this.isAnimating = true;
      cancelAnimationFrame(this.animationFrame);
      this.frameX = 0;
      this.buffActive = true;
      buff();
    };

    this.socket.on("animation_update2", (data) => {
      if (this.isAnimating) return; // Prevent starting new animation if one is already running

      const { animation, frameX, frameY } = data.data;

      // Log the incoming animation update
      console.log("Received animation update:", animation);

      this.frameX = frameX;
      this.frameY = frameY;
      this.gameFrame = 0;
      this.isAnimating = true; // Mark animation as in progress

      switch (animation) {
        case "attack1":
          this.isattack = true;
          attack1();
          break;
        case "attack2":
          this.isattack = true;
          attack2();
          break;
        case "attack3":
          this.isattack = true;
          attack3();
          break;
        case "buff":
          this.buffActive = true;
          buff();
          break;
        case "hurt":
          this.hurtActive = true;
          hurtAnimation(frameY);
          break;
        default:
          idle();
          break;
      }
    });

    idle();
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrame);
    if (this.socket) {
      this.socket.disconnect();
    }
  },
};
</script>

<style lang="scss" scoped>
.canvas-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

#canvas {
  margin-top: 12rem;
  width: 13rem;
  transition: transform 0.5s ease;
}

.moveLeft {
  transform: translateX(700px);
}

@media (max-width: 1366px) {
  .moveLeft {
    transform: translateX(600px);
  }

  #canvas {
    top: 20%;
    margin-top: calc(10vh + 6rem);
    width: calc(15vw + 3rem);
  }
}

@media (max-width: 1024px) {
  .moveLeft {
    transform: translateX(400px);
  }
  #canvas {
    margin-top: 23rem;
    width: 13rem;
    transition: transform 0.5s ease;
  }
}

@media (max-width: 768px) {
  .moveLeft {
    transform: translateX(200px);
  }
  #canvas {
    margin-top: 10rem;
    width: 13rem;
    transition: transform 0.5s ease;
  }
}

@media (max-width: 480px) {
  .moveLeft {
    transform: translateX(100px);
  }
  #canvas {
    margin-top: 18rem;
    width: 13rem;
    transition: transform 0.5s ease;
  }
}

button {
  margin-top: 5px;
}
</style>