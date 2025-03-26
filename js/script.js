document.addEventListener('DOMContentLoaded', function() {
    // Elementos
    const guardaChuvasWrapper = document.getElementById('guarda-chuvas-wrapper');
    const form = document.getElementById('formPerguntas');
    const numUmbrellasInput = document.getElementById('numUmbrellas');
    const updateUmbrellasButton = document.getElementById('updateUmbrellas');
    
    // Tons de amarelo para os guarda-chuvas
    const yellowShades = [
      '#FFD700', // Amarelo ouro
      '#FFFF00', // Amarelo puro
      '#F0E68C', // Caqui
      '#EEE8AA', // Amarelo palha
      '#FFC30B', // Amarelo âmbar
      '#FFDB58', // Amarelo mostarda
      '#FFE135'  // Amarelo banana
    ];
    
    // Array para armazenar todos os guarda-chuvas
    let umbrellas = [];
    
    // Classe para gerenciar cada guarda-chuva
    class Umbrella {
      constructor(id) {
        this.id = id;
        this.element = this.createUmbrellaElement();
        this.position = {
          x: Math.random() * (window.innerWidth - 60),
          y: Math.random() * (window.innerHeight - 60)
        };
        
        // Velocidade aleatória, mas mantendo a direção diagonal
        const speed = 0.4 + Math.random() * 1.5;
        this.velocity = {
          x: Math.random() > 0.5 ? speed : -speed,
          y: Math.random() > 0.5 ? speed : -speed
        };
        
        this.rotation = Math.random() * 360;
        this.rotationSpeed = 0.1 + Math.random() * 0.3;
        this.colorIndex = Math.floor(Math.random() * yellowShades.length);
        
        // Aplicar posição inicial
        this.updatePosition();
        
        // Aplicar cor inicial
        this.updateColor();
      }
      
      createUmbrellaElement() {
        const container = document.createElement('div');
        container.className = 'guarda-chuva-container';
        container.id = `guarda-chuva-${this.id}`;
        
        const img = document.createElement('img');
        img.src = 'assets/img/yellow_umbrella.svg';
        img.alt = 'Guarda-Chuva Amarelo';
        img.className = 'guarda-chuva';
        
        container.appendChild(img);
        guardaChuvasWrapper.appendChild(container);
        
        return {
          container: container,
          img: img
        };
      }
      
      update() {
        // Atualizar posição
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        
        // Verificar colisões com as bordas da tela
        const width = this.element.container.offsetWidth;
        const height = this.element.container.offsetHeight;
        
        let collision = false;
        
        // Colisão com a borda direita ou esquerda
        if (this.position.x + width > window.innerWidth) {
          this.position.x = window.innerWidth - width;
          this.velocity.x = -this.velocity.x;
          collision = true;
        } else if (this.position.x < 0) {
          this.position.x = 0;
          this.velocity.x = -this.velocity.x;
          collision = true;
        }
        
        // Colisão com a borda inferior ou superior
        if (this.position.y + height > window.innerHeight) {
          this.position.y = window.innerHeight - height;
          this.velocity.y = -this.velocity.y;
          collision = true;
        } else if (this.position.y < 0) {
          this.position.y = 0;
          this.velocity.y = -this.velocity.y;
          collision = true;
        }
        
        // Se houve colisão, escolher amarelo brilhante com maior chance
        if (collision) {
          // Se não for o amarelo brilhante, aumente a chance de escolher ele
          if (this.colorIndex !== 0 && Math.random() > 0.75) {
            this.colorIndex = 0; // Definir para amarelo brilhante
          } else {
            this.colorIndex = (this.colorIndex + 1) % yellowShades.length;
          }
          this.updateColor();
          
          // Adicionar um pequeno "pulso" no tamanho quando colide
          this.element.img.style.transform = 'scale(1.1)';
          setTimeout(() => {
            this.element.img.style.transform = 'scale(1)';
          }, 200);
        }
        
        // Rotacionar o guarda-chuva suavemente
        this.rotation += this.rotationSpeed;
        
        // Atualizar a posição e rotação do guarda-chuva
        this.updatePosition();
      }
      
      
      updatePosition() {
        this.element.container.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0) rotate(${this.rotation}deg)`;
      }
      
      updateColor() {
        const hueAngle = this.colorIndex * 5;
        this.element.img.style.filter = `drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.3)) hue-rotate(${hueAngle}deg) saturate(${1 + this.colorIndex * 0.2})`;
      }
      
      remove() {
        guardaChuvasWrapper.removeChild(this.element.container);
      }
    }
    
    // Função para criar guarda-chuvas
    function createUmbrellas(count) {
      // Remover guarda-chuvas existentes
      umbrellas.forEach(umbrella => umbrella.remove());
      umbrellas = [];
      
      // Criar novos guarda-chuvas
      for (let i = 0; i < count; i++) {
        umbrellas.push(new Umbrella(i));
      }
    }
    
    // Função de animação principal
    function animate() {
      // Atualizar cada guarda-chuva
      umbrellas.forEach(umbrella => umbrella.update());
      
      // Continuar a animação
      requestAnimationFrame(animate);
    }
    
    // Inicializar com 5 guarda-chuvas por padrão
    createUmbrellas(5);
    
    // Iniciar a animação
    animate();
    
    // Manipulador para atualizar o número de guarda-chuvas
    updateUmbrellasButton.addEventListener('click', function() {
      const count = parseInt(numUmbrellasInput.value);
      if (count >= 1 && count <= 20) {
        createUmbrellas(count);
      } else {
        alert('Por favor, escolha um número entre 1 e 20.');
      }
    });
    
    // Manipulador de envio do formulário
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      const nome = document.getElementById('nome').value;
      const pergunta = document.getElementById('pergunta').value;
      
      // Aqui você pode adicionar código para enviar os dados para um servidor
      console.log('Pergunta enviada por:', nome);
      console.log('Pergunta:', pergunta);
      
      // Limpar o formulário
      form.reset();
      
      // Mostrar uma mensagem de confirmação
      alert('Obrigado pela sua pergunta! Responderemos em breve.');
    });
    
    // Ajustar a animação quando a janela for redimensionada
    window.addEventListener('resize', function() {
      // Garantir que os guarda-chuvas permaneçam dentro dos limites da tela
      umbrellas.forEach(umbrella => {
        const width = umbrella.element.container.offsetWidth;
        const height = umbrella.element.container.offsetHeight;
        
        if (umbrella.position.x + width > window.innerWidth) {
          umbrella.position.x = window.innerWidth - width;
        }
        if (umbrella.position.y + height > window.innerHeight) {
          umbrella.position.y = window.innerHeight - height;
        }
        
        umbrella.updatePosition();
      });
    });
  });