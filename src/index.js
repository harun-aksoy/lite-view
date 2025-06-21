export const uiComponents = {
    // normalize
    
    ui: {
        init(self) {
            
            self.style.display = "flex";
            self.style.flexDirection = "column";
            self.style.alignItems = "center";
            self.style.textAlign = "center";
            self.style.boxSizing = "border-box";
            self.style.transformOrigin = "50% 50%";
            self.style.position = "relative";
            self.style.overflow = "visible";
            return self;
        },
    }, 
    
    animation: {
      init(self) {
        const anim = {
          _easeType: "linear",
          _duration: 1,
          _delay: 0,
          _repeat: 1,
          _autoreverse: true,
          _spring: null,
          _isPlaying: false,
          _handler: null,
          _onEnd: null,
          _updateRef: null,

          ease(type = "linear", duration = 1) {
            this._easeType = type;
            this._duration = duration;
            return this;
          },

          delay(seconds = 0) {
            this._delay = seconds;
            return this;
          },

          repeat(count = 1) {
            this._repeat = count;
            return this;
          },

          reverse(enabled = true) {
            this._autoreverse = enabled;
            return this;
          },

          spring({ damping = 10, stiffness = 100, bounce = 0.5 }) {
            this._spring = { damping, stiffness, bounce };
            return this;
          },

          onEnd(callback) {
            this._onEnd = () => callback(self);
            return this;
          },

          start(handler) {
            this._handler = handler;
            this._isPlaying = true;

            const startTime = performance.now() + this._delay * 1000;
            let currentLoop = 0;

            const easings = {
              linear: t => t,
              easeOut: t => 1 - Math.pow(1 - t, 3),
              easeIn: t => t * t * t,
              easeInOut: t =>
                t < 0.5
                  ? 4 * t * t * t
                  : 1 - Math.pow(-2 * t + 2, 3) / 2,
              bounce: t => {
                const n1 = 7.5625, d1 = 2.75;
                if (t < 1 / d1) return n1 * t * t;
                if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
                if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
              }
            };

            const springProgress = (t) => {
              const { damping, stiffness } = this._spring;
              return 1 - Math.exp(-damping * t) * Math.cos(stiffness * t);
            };

            // referans saklanıyor
            const updateFn = (self, dt, now) => {
              if (!this._isPlaying || now < startTime) return;

              const elapsed = (now - startTime) / (this._duration * 1000);
              let progress = Math.min(elapsed % 1, 1);
              const loopCount = Math.floor(elapsed);

              if (this._autoreverse && loopCount % 2 === 1) {
                progress = 1 - progress;
              }

              progress = easings[this._easeType]?.(progress) || progress;
              if (this._spring) progress = springProgress(progress);

              this._handler(self,progress);

              if (elapsed >= this._repeat) {
                this._isPlaying = false;
                self.off("update", this._updateRef); // kaldır
                if (this._onEnd) this._onEnd();
              }
            };

            this._updateRef = updateFn;
            self.on("update", updateFn);

            return self;
          }
        };

        self.animation = anim;
        return self;
      }
    },


    // color
    color(self,value) {
        const hasText = !!self.value;
        if (value === undefined) {
            return hasText ? self.style.color : self.style.background;
        }
        if (hasText) {
            self.style.color = value;
        } else {
            self.style.background = value;
        }
        return self;
    },

    // opacity
    opacity(self,value) {
        if (value === undefined) return parseFloat(self.style.opacity || 1);
        self.style.opacity = isNaN(value) ? value : parseFloat(value);
        return self;
    },

    radius(self, ...radii) {
        if (radii.length === 0) {
            return self.style.borderRadius
                .split(" ")
                .map(r => parseFloat(r));
        }
        self.style.borderRadius = radii
            .map(r => isNaN(r) ? r : `${r}px`)
            .join(" ");

        return self;
    },


    // padding
    padding(self,...values) {
        if (values.length === 0)
            return self.style.padding.split(" ").map((p) => parseFloat(p));
        self.style.padding = values
            .map(v => isNaN(v) ? v : `${v}px`)
            .join(" ");
        return self;
    },

    border(self,color = 'black', width = 2, style = 'solid') {
        self.style.border = `${width}px ${style} ${color}`;
        return self;
    },

    shadow(self,color = 'rgba(0,0,0,0.25)', radius = 6, x = 0, y = 4) {
        if (Array.isArray(x)) [x, y] = x;
        self.style.boxShadow = `${x}px ${y}px ${radius}px ${color}`;
        return self;
    },

    // filter / backdrop
    filter(self,value) {
        if (value === undefined) return self.style.filter;
        self.style.filter = value;
        return self;
    },
    backdrop(self,value) {
        if (value === undefined) return self.style.backdropFilter;
        self.style.backdropFilter = value;
        return self;
    },
    
    // clip - mask
    clip(self,value) {
        if (value === undefined) return self.style.clipPath;
        self.style.clipPath = value;
        return self;
    },

    // frame
    frame(self, w, h) {
        // Get mode: .frame()
        if (w === undefined && h === undefined) {
            const parse = (v) => parseFloat(v) || 0;
            return [parse(self.style.width), parse(self.style.height)];
        }

        if (Array.isArray(w)) [w, h] = w;
        // Width
        if (w !== undefined) {
            if (w === Infinity) {
                self.style.flex = "0 1 auto";
                self.style.width = "100%";
            } else if (w === 0) {
                self.style.flex = "0 0 auto";
                self.style.width = ""; // shrink: içerik kadar
            } else {
                self.style.flex = "0 0 auto";
                self.style.width = `${w}px`;
            }
        }

        // Height
        if (h !== undefined) {
            if (h === Infinity) {
                self.style.flex = "0 1 auto";
                self.style.height = "100%";
            } else if (h === 0) {
                self.style.flex = "0 0 auto";
                self.style.height = ""; // shrink: içerik kadar
            } else {
                self.style.flex = "0 0 auto";
                self.style.height = `${h}px`;
            }
        }

        return self;
    },

    offset(self, x, y, z) {
        if (Array.isArray(x)) [x, y, z] = x;
        if (x != undefined) self.style.left = `${x}px`;
        if (y != undefined) self.style.top = `${y}px`;
        if (y != undefined) self.style.zIndex = z;

        return self;
    },
    
    position(self, x, y, z) {
        // Getter mode
        if (x === undefined && y === undefined && z === undefined) {
          const px = parseFloat(self.style.left) || 0;
          const py = parseFloat(self.style.top) || 0;
          const pz = parseInt(self.style.zIndex) || 0;
          return [px, py, pz];
        }
        
        self.style.position = "absolute";

        if (Array.isArray(x)) [x, y, z] = x;
        if (x !== undefined) {
            self.style.left = (x === Infinity) ? "100%" : `${x}px`;
        }
        if (y !== undefined) {
            self.style.top = (y === Infinity) ? "100%" : `${y}px`;
        }
        if (z !== undefined) {
            self.style.zIndex = z;
        }

        // Anchoring (merkezden konumlama)
        self._transform ??= {};
        if (!self._transform.anchored) {
          self.style.transform = (self.style.transform || "") + " translate(-50%, -50%)";
          self._transform.anchored = true;
        }

        return self;
    },

    rotation(self, x, y, z) {
        self._transform ??= { r: [0, 0, 0] };
        const r = self._transform.r;

        // Getter mode
        if (x === undefined && y === undefined && z === undefined) {
          return [...r]; // kopya döner
        }

        // Array input
        if (Array.isArray(x)) [x, y, z] = x;
        if (x !== undefined) r[0] = x;
        if (y !== undefined) r[1] = y;
        if (z !== undefined) r[2] = z;

        // Rotation string
        const rotate = `rotateX(${r[0]}deg) rotateY(${r[1]}deg) rotateZ(${r[2]}deg)`;

        // Anchoring varsa ona göre transform oluştur
        self.style.transform = rotate + (self._transform.anchored ? " translate(-50%, -50%)" : "");

        return self;
    },

    anchor(self, x, y) {
        if (Array.isArray(x)) [x, y] = x;
        self.style.transformOrigin = `${x * 100}% ${y * 100}%`;
        
        return self;
    },

    // scroll
    scroll(self,value = true) {
        if (value) {
            // Yöne göre kaydırma ayarla
            const dir = self.style.flexDirection;
            if (dir === "column") {
                self.style.overflowY = "auto";
                self.style.overflowX = "hidden";
            } else if (dir === "row") {
                self.style.overflowX = "auto";
                self.style.overflowY = "hidden";
            } else {
                // Belirli yön yoksa her iki yönde scroll ver
                self.style.overflow = "auto";
            }
        } else {
            // Scroll'u tamamen kapat
            self.style.overflow = "hidden";
            self.style.overflowX = "hidden";
            self.style.overflowY = "hidden";
        }
        return self;
    },

    // spacing
    spacing(self,value) {
        if (value === undefined) return parseFloat(self.style.gap);
        self.style.gap = isNaN(value) ? value : `${value}px`;
        return self;
    },

    // alignment
    alignment(self,value) {
        const map = {
            leading: "flex-start",
            center: "center",
            trailing: "flex-end"
        };
        if (value === undefined) return self.style.alignItems;
        self.style.alignItems = map[value] || value;
        return self;
    },

    // Fonts
    font: {
        size(self,px) {
            self.style.fontSize = isNaN(px) ? px : `${px}px`;
            return self;
        },
        weight(self,w) {
            self.style.fontWeight = w;
            return self;
        },
        family(self,f) {
            self.style.fontFamily = f;
            return self;
        },
        space(self,px) {
            self.style.letterSpacing = isNaN(px) ? px : `${px}px`;
            return self;
        },
        align(self,value) {
            self.style.textAlign = value;
            return self;
        },
        italic(self,enabled) {
            self.style.fontStyle = enabled === false ? "normal" : "italic";
            return self;
        },
        smallcaps(self,enabled) {
            self.style.fontVariant =
                enabled === false ? "normal" : "small-caps";
            return self;
        },
        bold(self,enabled) {
            self.style.fontWeight = enabled === false ? "normal" : "bold";
            return self;
        },
        underline(self,enabled) {
            self.style.textDecoration =
                enabled === false ? "none" : "underline";
            return self;
        }
    },

    // src
    src(self,value) {
        self.style.backgroundImage = `url("${value}")`;
        self.style.backgroundSize = "cover";
        self.style.backgroundPosition = "center";
        return self;
    },

    // cursor
    cursor(self,value) {
        self.style.cursor = value;
        return self;
    },

    display(self,value) {
        if (value === undefined) return self.style.display;
        self.style.display = value;
        return self;
    },

    // MarkDown
    markdown(self,text) {
        self.innerHTML = marked.parse(text);
        return self;
    },

    // Responsive
    responsive(self,breakpoint, callback) {
        if (!self._responsiveRanges) {
            self._responsiveRanges = [];
            self._responsiveHandler = () => {
                const width = window.innerWidth;
                for (let i = 0; i < self._responsiveRanges.length; i++) {
                    const range = self._responsiveRanges[i];
                    const next = self._responsiveRanges[i + 1];
                    const min = range.breakpoint;
                    const max = next ? next.breakpoint : Infinity;

                    if (width >= min && width < max) {
                        if (self._lastApplied !== min) {
                            self._lastApplied = min;
                            range.callback(self);
                        }
                        break;
                    }
                }
            };
            window.addEventListener("resize", self._responsiveHandler);
        }

        self._responsiveRanges.push({ breakpoint, callback });
        self._responsiveRanges.sort((a, b) => a.breakpoint - b.breakpoint);
        self._responsiveHandler(); // ilk anda uygula

        return self;
    },
    
    drag(self) {
      let isDragging = false;
      let offsetX, offsetY;

      self.style.position = 'absolute';
      self.style.cursor = 'grab';

      self.on('mousedown', (e) => {
        isDragging = true;
        offsetX = e.clientX - self.getBoundingClientRect().left;
        offsetY = e.clientY - self.getBoundingClientRect().top;
        self.style.cursor = 'grabbing';
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        self.style.left = `${e.clientX - offsetX}px`;
        self.style.top = `${e.clientY - offsetY}px`;
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
        self.style.cursor = 'grab';
      });

      return self;
    },

};


export const LiteView = (...children) => {
    const element = document.createElement('div');
    
    element.active = true;
    
    element.child = (...children) => {
		if (children.length === 0) {
			if (element.children.length === 0) {
				return element.value || "";
			}
			return Array.from(element.children);
		}
		if (children.length === 1 && typeof children[0] === "number") {
			return element.children[children[0]];
		}
		if (children.length === 1 && typeof children[0] === "string") {
			element.value = children[0];
			element.textContent = children[0];
			return element;
		}
		children.flat().forEach((child) => {
			if (child instanceof HTMLElement) {
				element.appendChild(child);
			}
		});
		return element;
	};
    element.child(...children);
    
    element.parent = (parent) => {
        if (parent === undefined) return element.parentElement;
        parent.appendChild(element); // appendChild ile sona ekle
        return element;
    };

	element.clone = () => {
		const cloned = View(...[...element.childNodes].map((n) => n.cloneNode(true)));
		cloned.style.cssText = element.style.cssText;
		cloned.className = element.className;
		cloned.id = element.id;
		return cloned;
	};
    
    // class
	element.tags = (...values) => {
		if (values.length === 0) {
			return element.className.trim().split(/\s+/);
		}
		element.className = values.join(" ");
		return element;
	};
    
    // id
    element.name = (value) => {
	if (value === undefined) return element.id;
	element.id = value;
	return element;  
     };
    
	element.destroy = () => {
        for (const event in element._listeners) {
            element.off(event);
        }
		element.remove();
		return null;
	};
    
    // event systems
    element._listeners = {};

    element.on = (event, handler) => {
      (element._listeners[event] ??= []).push((...args) => handler(element, ...args));

      if (event in element) {
        element.addEventListener?.(event, e => element.emit(event, e), { once: false, passive: true });
      }
    
      return element;
    };
    
    element.off = (event) => {
      delete element._listeners[event];
      element.removeEventListener?.(event, element._domListeners?.[event]);
      return element;
    };
    
    element.emit = (event, ...args) => {
      element._listeners[event]?.forEach(fn => fn(...args));
    };
    
    
    // components
    element.components = (all) => {
      for (const name in all) {
        if (typeof all[name] === 'function') {
          element[name] = (...args) => all[name](element, ...args);
        } else {
          element[name] = {};
          for (const key in all[name]) {
            const fn = (...args) => all[name][key](element, ...args);
            element[name][key] = fn;

            if (key === "init") element.on("init", (self) => fn(self));
            if (key === "update") element.on("update", (self, dt, t) => fn(dt, t));
          }
        }
      }
        
      element.emit("init", element);
        
      // Update başlatıcısı /////////////
      element.update_started = element.update_started || false;

      element.update = () => {
        if (element.update_started) return element;
        element.update_started = true;

        let lastTime = performance.now();
        let totalTime = 0;

        const loop = () => {
          const now = performance.now();
          const dt = now - lastTime;
          lastTime = now;
          totalTime += dt;

          if (element.active !== false) {
            element.emit("update", dt, totalTime);
          }

          requestAnimationFrame(loop);
        };

        requestAnimationFrame(loop);
        return element;
      };
      element.update();
      // Update başlatıcısı ////////////
        
      return element;
    };

    

    return element;
};


// Sadece modül dışı kullanımda global'e yaz:
if (typeof window !== "undefined" && !window.LiteView) {
  window.LiteView = LiteView;
}


export const View = (...children)=> {
    return LiteView(...children).components(uiComponents)
}
