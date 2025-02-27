import React, { useEffect, useState } from 'react';
import { FiMoon, FiSun } from 'react-icons/fi';
import { useHistory } from 'react-router-dom';

import { SearchFiltersURL } from '../../types';
import Modal from '../common/Modal';
import CommandBlock from './installation/CommandBlock';
import styles from './WidgetModal.module.css';

interface Props {
  packageId: string;
  packageName: string;
  packageDescription: string;
  visibleWidget: boolean;
  searchUrlReferer?: SearchFiltersURL;
  fromStarredPage?: boolean;
  setOpenStatus: React.Dispatch<React.SetStateAction<boolean>>;
}

interface WidgetTheme {
  name: string;
  icon: JSX.Element;
}

const DEFAULT_THEME = 'light';
const THEMES: WidgetTheme[] = [
  {
    name: DEFAULT_THEME,
    icon: <FiSun />,
  },
  { name: 'dark', icon: <FiMoon /> },
];

const WidgetModal = (props: Props) => {
  const history = useHistory();
  const [theme, setTheme] = useState<string>(DEFAULT_THEME);
  const [header, setHeader] = useState<boolean>(true);
  const [responsive, setRepsonsive] = useState<boolean>(false);

  const compoundWidgetSource = (): string => {
    const url = `${window.location.origin}${window.location.pathname}`;
    const code = `<div class="artifacthub-widget" data-url="${url}" data-theme="${theme}" data-header="${
      !header ? 'false' : 'true'
    }" data-responsive="${responsive ? 'true' : 'false'}"><blockquote><p lang="en" dir="ltr"><b>${
      props.packageName
    }</b>${
      props.packageDescription ? `: ${props.packageDescription}` : ''
    }</p>&mdash; Open in <a href="${url}">Artifact Hub</a></blockquote></div><script async src="${
      window.location.origin
    }/artifacthub-widget.js"></script>`;

    return code;
  };

  const [widgetSource, setWidgetSource] = useState<string>(compoundWidgetSource());

  const onCloseModal = () => {
    props.setOpenStatus(false);
    history.replace({
      search: '',
      state: { searchUrlReferer: props.searchUrlReferer, fromStarredPage: props.fromStarredPage },
    });
  };

  useEffect(() => {
    setWidgetSource(compoundWidgetSource());
  }, [theme, header, responsive, props.packageId]); /* eslint-disable-line react-hooks/exhaustive-deps */

  useEffect(() => {
    if (props.visibleWidget) {
      history.replace({
        search: '?modal=widget',
        state: { searchUrlReferer: props.searchUrlReferer, fromStarredPage: props.fromStarredPage },
      });
    }
  }, [props.visibleWidget]); /* eslint-disable-line react-hooks/exhaustive-deps */

  return (
    <>
      {props.visibleWidget && (
        <Modal
          modalDialogClassName={styles.modalDialog}
          header={<div className={`h3 m-2 flex-grow-1 ${styles.title}`}>Widget</div>}
          onClose={onCloseModal}
          open={props.visibleWidget}
        >
          <div className="w-100 position-relative">
            <label className={`font-weight-bold ${styles.label}`} htmlFor="theme">
              Theme
            </label>
            <div className="d-flex flex-row mb-3">
              {THEMES.map((themeOpt: WidgetTheme) => {
                return (
                  <div className="custom-control custom-radio mr-4" key={`radio_theme_${themeOpt.name}`}>
                    <input
                      className="custom-control-input"
                      type="radio"
                      name="theme"
                      id={themeOpt.name}
                      value={themeOpt.name}
                      checked={theme === themeOpt.name}
                      required
                      readOnly
                    />
                    <label
                      className="text-capitalize custom-control-label"
                      htmlFor={themeOpt.name}
                      onClick={() => {
                        setTheme(themeOpt.name);
                      }}
                    >
                      <div className="d-flex flex-row align-items-center">
                        {themeOpt.icon}
                        <span className="ml-1">{themeOpt.name}</span>
                      </div>
                    </label>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 mb-3">
              <div className="custom-control custom-switch pl-0">
                <input
                  id="header"
                  type="checkbox"
                  className="custom-control-input"
                  value="true"
                  onChange={() => setHeader(!header)}
                  checked={header}
                />
                <label
                  htmlFor="header"
                  className={`custom-control-label font-weight-bold ${styles.label} ${styles.customControlRightLabel}`}
                >
                  Header
                </label>
              </div>

              <small className="form-text text-muted mt-2">
                Displays Artifact Hub header at the top of the widget.
              </small>
            </div>

            <div className="mt-4 mb-3">
              <div className="custom-control custom-switch pl-0">
                <input
                  id="responsive"
                  type="checkbox"
                  className="custom-control-input"
                  value="true"
                  onChange={() => setRepsonsive(!responsive)}
                  checked={responsive}
                />
                <label
                  htmlFor="responsive"
                  className={`custom-control-label font-weight-bold ${styles.label} ${styles.customControlRightLabel}`}
                >
                  Responsive
                </label>
              </div>

              <small className="form-text text-muted mt-2">
                The widget will try to use the width available on the parent container (between 350px and 650px).
              </small>
            </div>

            <div className="mt-5">
              <label className={`font-weight-bold ${styles.label}`}>Code</label>

              <CommandBlock command={widgetSource} language="javascript" />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default WidgetModal;
