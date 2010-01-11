/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.funambol.rhinounit;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.apache.commons.io.IOUtils;

/**
 *
 * @author ste
 */
public class RhinoUnitLoader {

    private static final String[] SCRIPTS = new String[]{
        "/js/jsUnitCore.js",
        "/js/xbDebug.js",
        "/js/jsUnitResult.js",
        "/js/jsUnitResultWriter.js",
        "/js/jsUnitTestManager.js",
        "/js/jsUnitTestSuite.js",
        "/js/jsUnitTracer.js"
    };

    public RhinoUnitLoader() {
    }

    public String loadBootstrapScripts() throws IOException {
        StringBuffer ret = new StringBuffer();

        InputStream is = null;
        for (int i=0; i<SCRIPTS.length; ++i) {
            try {
                is = getClass().getResourceAsStream(SCRIPTS[i]);
                if (is == null) {
                    throw new FileNotFoundException("Resource " + SCRIPTS[i] + " not found in classpath");
                }
                
                ret.append(IOUtils.toString(is)).append("\n\n");
            } finally {
                if (is != null) {
                    is.close();
                }
            }
        }

        return ret.toString();
    }
}
