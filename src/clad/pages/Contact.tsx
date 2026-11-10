import { ContactForm } from "../ContactForm";
import { textEditProps } from "../Editable";
import { Words } from "../bits";
import { useContent } from "../store";

export default function Contact() {
  const { email, address } = useContent().text;
  return (
    <div className="cl-detail cl-contact">
      <header className="cl-detail__top">
        <Words id="contactHeading" as="h1" />
        <p className="cl-detail__hint">Scroll down</p>
      </header>

      <section className="cl-contact__form">
        <ContactForm />
      </section>

      <section className="cl-detail__body cl-grid">
        <div className="cl-contact__meta" data-reveal="">
          <a href={`mailto:${email}`} className="cl-ul" {...textEditProps("email")}>
            {email}
          </a>
          <address {...textEditProps("address")}>{address}</address>
        </div>
      </section>
    </div>
  );
}
