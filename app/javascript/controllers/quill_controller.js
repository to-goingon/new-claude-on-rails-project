import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["editor", "hiddenInput"]
  static values = {
    placeholder: String,
    readonly: Boolean
  }

  connect() {
    // Wait for Quill to be available globally
    if (typeof window.Quill !== 'undefined') {
      this.initializeQuill()
      this.setupFontSizes()
    } else {
      // Wait a bit for the library to load
      setTimeout(() => {
        if (typeof window.Quill !== 'undefined') {
          this.initializeQuill()
          this.setupFontSizes()
        } else {
          console.error('Quill library not found')
        }
      }, 100)
    }
  }

  disconnect() {
    if (this.quill) {
      this.quill = null
    }
  }

  initializeQuill() {
    const toolbarOptions = [
      // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'size': ['8px', '10px', '12px', '14px', '16px', '18px', '24px', '32px', '48px', '72px'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'script': 'sub' }, { 'script': 'super' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'direction': 'rtl' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ]

    this.quill = new window.Quill(this.editorTarget, {
      modules: {
        toolbar: toolbarOptions
      },
      theme: 'snow',
      placeholder: this.placeholderValue || 'Start typing...',
      readOnly: this.readonlyValue || false
    })

    // Update hidden input when content changes
    this.quill.on('text-change', () => {
      if (this.hasHiddenInputTarget) {
        this.hiddenInputTarget.value = this.quill.root.innerHTML
      }
    })

    // Load initial content from hidden input
    if (this.hasHiddenInputTarget && this.hiddenInputTarget.value) {
      this.quill.root.innerHTML = this.hiddenInputTarget.value
    }
  }

  setupFontSizes() {
    // Register custom size attributor
    const SizeStyle = window.Quill.import('attributors/style/size')
    SizeStyle.whitelist = ['8px', '10px', '12px', '14px', '16px', '18px', '24px', '32px', '48px', '72px']
    window.Quill.register(SizeStyle, true)

    // Add CSS for dropdown options to show actual font sizes
    this.addFontSizeStyles()
  }

  addFontSizeStyles() {
    const style = document.createElement('style')
    style.textContent = `
      .ql-size .ql-picker-options {
        font-family: Arial, sans-serif;
      }
      
      .ql-size .ql-picker-item[data-value="8px"] {
        font-size: 8px !important;
      }
      .ql-size .ql-picker-item[data-value="8px"]::before {
        content: "8px" !important;
        font-size: 8px !important;
      }
      
      .ql-size .ql-picker-item[data-value="10px"] {
        font-size: 10px !important;
      }
      .ql-size .ql-picker-item[data-value="10px"]::before {
        content: "10px" !important;
        font-size: 10px !important;
      }
      
      .ql-size .ql-picker-item[data-value="12px"] {
        font-size: 12px !important;
      }
      .ql-size .ql-picker-item[data-value="12px"]::before {
        content: "12px" !important;
        font-size: 12px !important;
      }
      
      .ql-size .ql-picker-item[data-value="14px"] {
        font-size: 14px !important;
      }
      .ql-size .ql-picker-item[data-value="14px"]::before {
        content: "14px" !important;
        font-size: 14px !important;
      }
      
      .ql-size .ql-picker-item[data-value="16px"] {
        font-size: 16px !important;
      }
      .ql-size .ql-picker-item[data-value="16px"]::before {
        content: "16px" !important;
        font-size: 16px !important;
      }
      
      .ql-size .ql-picker-item[data-value="18px"] {
        font-size: 18px !important;
      }
      .ql-size .ql-picker-item[data-value="18px"]::before {
        content: "18px" !important;
        font-size: 18px !important;
      }
      
      .ql-size .ql-picker-item[data-value="24px"] {
        font-size: 24px !important;
      }
      .ql-size .ql-picker-item[data-value="24px"]::before {
        content: "24px" !important;
        font-size: 24px !important;
      }
      
      .ql-size .ql-picker-item[data-value="32px"] {
        font-size: 32px !important;
      }
      .ql-size .ql-picker-item[data-value="32px"]::before {
        content: "32px" !important;
        font-size: 32px !important;
      }
      
      .ql-size .ql-picker-item[data-value="48px"] {
        font-size: 48px !important;
      }
      .ql-size .ql-picker-item[data-value="48px"]::before {
        content: "48px" !important;
        font-size: 48px !important;
      }
      
      .ql-size .ql-picker-item[data-value="72px"] {
        font-size: 72px !important;
      }
      .ql-size .ql-picker-item[data-value="72px"]::before {
        content: "72px" !important;
        font-size: 72px !important;
      }
      
      .ql-size .ql-picker-item[data-value=""] {
        font-size: 14px !important;
      }
      .ql-size .ql-picker-item[data-value=""]::before {
        content: "Normal" !important;
        font-size: 14px !important;
      }
    `

    if (!document.querySelector('#quill-font-size-styles')) {
      style.id = 'quill-font-size-styles'
      document.head.appendChild(style)
    }
  }

  // Public method to get content
  getContent() {
    return this.quill ? this.quill.getContents() : null
  }

  // Public method to set content
  setContent(delta) {
    if (this.quill) {
      this.quill.setContents(delta)
    }
  }

  // Public method to get HTML
  getHTML() {
    return this.quill ? this.quill.root.innerHTML : ''
  }

  // Public method to get text
  getText() {
    return this.quill ? this.quill.getText() : ''
  }
}