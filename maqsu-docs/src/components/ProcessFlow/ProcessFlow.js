import clsx from "clsx";
import styles from "./styles.module.css";
// import  ServiceFlow from "./ServiceFlow";
export const ProcessFlow = ({ steps }) => {
    return (
        <div className={clsx(styles.process_flow_container)}>
            {steps?.map((step, i) => (
                <>
                <div className={clsx(styles.process_step)} key={i}>
                    <div className={clsx(styles.step_inner)}>
                        <div className={clsx(styles.step_circle)}>{i + 1}</div>
                        <div className={clsx(styles.step_content)}>
                            <h4 className={clsx(styles.step_title)}>{step.title}</h4>
                            <p className={clsx(styles.step_description)}>{step.description}</p>
                        </div>
                    </div>
                    {i < steps.length - 1 && <div className={clsx(styles.step_arrow)}>→</div>}
                </div>
                </>
            ))}
            {/* <ServiceFlow steps={steps}/> */}
        </div>
    );
};
